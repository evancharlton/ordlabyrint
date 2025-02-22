import { Modal } from "./Modal";

export const AboutDialog = () => {
  return (
    <Modal title="Ordlabyrint" kind="about">
      <p>
        <strong>Ordlabyrint</strong> er en app for å lære nye norsk ord. Det er
        gratis å spille og trenger ingen personlig informasjon.
      </p>
      <hr />
      <p>
        Spørsmål?{" "}
        <a href="mailto:evancharlton+ordlabryint@evancharlton.com">
          evancharlton@gmail.com
        </a>
      </p>
      <hr />
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        versjon <code>{import.meta.env.VITE_RELEASE ?? "development"}</code>
      </span>
    </Modal>
  );
};
