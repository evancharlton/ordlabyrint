import { Modal } from "../Page/Modal";
import { useBoardId } from "../BoardIdProvider";
import { useHref, useParams } from "react-router";
import classes from "./ShareDialog.module.css";
import { MdContentCopy, MdShare } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";

type CopyState = "waiting" | "error" | "copying" | "copied";

const COPY: Record<CopyState, { text: string; disabled: boolean }> = {
  waiting: { text: "kopier", disabled: false },
  error: { text: "kopier", disabled: true },
  copying: { text: "kopierer ...", disabled: true },
  copied: { text: "kopiert!", disabled: false },
} as const;

type ShareState = "waiting" | "error" | "unavailable" | "sharing" | "shared";

const SHARE: Record<ShareState, { text: string; disabled: boolean }> = {
  waiting: { text: "del", disabled: false },
  error: { text: "del", disabled: true },
  unavailable: { text: "del", disabled: true },
  sharing: { text: "deler ...", disabled: true },
  shared: { text: "delt!", disabled: false },
};

export const ShareDialog = () => {
  const { id } = useBoardId();

  const { lang, size } = useParams();
  const href = useHref(`/${lang}/${size}/${id}`);
  const url = [`${window.location.protocol}/`, window.location.host, href].join(
    "/"
  );

  const [copyState, setCopyState] = useState<CopyState>("waiting");
  const [shareState, setShareState] = useState<ShareState>("waiting");

  const text = useMemo(() => {
    return [`Prøve å løse denne ordlabyrinten!`, "", url].join("\n");
  }, [url]);

  useEffect(() => {
    setShareState(navigator.canShare?.({ text }) ? "waiting" : "unavailable");
  }, [text]);

  return (
    <Modal title="Del spill" kind="share" className={classes.dialog}>
      <p>Del dette puslespill med en venn:</p>
      <code className={classes.url}>{url}</code>
      <div className={classes.buttons}>
        <button
          disabled={COPY[copyState].disabled}
          onClick={() => {
            setCopyState("copying");
            navigator.clipboard
              .writeText(text)
              .then(() => {
                setCopyState("copied");
              })
              .catch((e) => {
                console.warn(e);
                setCopyState("error");
              });
          }}
        >
          <MdContentCopy /> {COPY[copyState].text}
        </button>
        <button
          disabled={SHARE[shareState].disabled}
          onClick={() => {
            setShareState("sharing");
            navigator
              .share({ text })
              .then(() => {
                setShareState("shared");
              })
              .catch((e) => {
                console.warn(e);
                setShareState("error");
              });
          }}
        >
          <MdShare /> del
        </button>
      </div>
    </Modal>
  );
};
