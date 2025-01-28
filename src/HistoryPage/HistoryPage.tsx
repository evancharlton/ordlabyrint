import { useMemo } from "react";
import { useStorageData } from "../StorageContainer";
import { Loader } from "../spa-components/Loader";
import { useGridSize } from "../GridSizeProvider";
import { useLanguage } from "../spa-components/LanguageSelector";
import { HistoryData, Solution } from "../HistoryProvider";
import classes from "./HistoryPage.module.css";
import { Link } from "react-router";
import { SolutionData } from "../SolutionProvider";
import { FavoritesData } from "../FavoritesProvider";
import { MdDoneAll, MdStar } from "react-icons/md";

const rate = (words: string[]) => {
  return words.length * 100 + words.join("").length;
};

type HistoryEntry = {
  gameId: string;
  when?: Date;
  foundSolutions?: Solution[];
  revealedSolution?: Solution;
  favoritedAt?: number;
};

const useData = () => {
  const { lang } = useLanguage();
  const { key: sizeKey } = useGridSize();
  const { data: historyData, state: historyState } =
    useStorageData<HistoryData>(`${lang}/${sizeKey}/history`, {});

  const { data: solutionsData, state: solutionsState } =
    useStorageData<SolutionData>(`${lang}/${sizeKey}/solutions`, {});

  const { data: favoritesData, state: favoritesState } =
    useStorageData<FavoritesData>(`${lang}/${sizeKey}/favorites`, {});

  const combined = useMemo<(HistoryEntry & { when: Date })[]>(() => {
    const all: Record<string, HistoryEntry> = {};
    Object.entries(historyData).forEach(([gameId, solutions]) => {
      if (!all[gameId]) {
        all[gameId] = {
          gameId,
          foundSolutions: solutions,
        };
      } else {
        all[gameId].foundSolutions = solutions;
      }
    });

    Object.entries(solutionsData).forEach(([gameId, solution]) => {
      if (!all[gameId]) {
        all[gameId] = {
          gameId,
          revealedSolution: solution,
        };
      } else {
        all[gameId].revealedSolution = solution;
      }
    });

    Object.entries(favoritesData).forEach(([gameId, favoriteTimestamp]) => {
      if (!all[gameId]) {
        all[gameId] = {
          gameId,
          favoritedAt: favoriteTimestamp,
        };
      } else {
        all[gameId].favoritedAt = favoriteTimestamp;
      }
    });

    return Object.values(all)
      .map((a) => {
        const latestTimestamp = Math.max(
          a.favoritedAt ?? 0,
          a.revealedSolution?.timestamp ?? 0,
          ...(a.foundSolutions?.map(({ timestamp }) => timestamp) ?? []),
        );

        return {
          ...a,
          when: new Date(latestTimestamp),
        };
      })
      .sort(({ when: a }, { when: b }) => {
        return b.getTime() - a.getTime();
      });
  }, [favoritesData, historyData, solutionsData]);

  if (
    historyState !== "loaded" ||
    solutionsState !== "loaded" ||
    favoritesState !== "loaded"
  ) {
    return undefined;
  }

  return combined;
};

const pad = (v: string | number) => `00${v}`.substr(-2);

export const HistoryPage = () => {
  const { lang } = useLanguage();
  const { key: sizeKey } = useGridSize();
  const combined = useData();

  if (!combined) {
    return <Loader text="laster" />;
  }

  return (
    <div className={classes.container}>
      {combined.map(
        ({
          gameId,
          favoritedAt = 0,
          revealedSolution,
          foundSolutions = [],
          when,
        }) => {
          const solutions = foundSolutions.length;
          const [best] = foundSolutions.sort(({ words: a }, { words: b }) => {
            return rate(a) - rate(b);
          });
          const others = solutions - 1;

          const solvedSolution = revealedSolution;

          return (
            <Link
              to={`/${lang}/${sizeKey}/${gameId}`}
              key={gameId}
              className={classes.entry}
            >
              {favoritedAt ? (
                <MdStar className={classes.favorite} />
              ) : (
                <div className={classes.favorite} />
              )}
              <span className={classes.info}>
                {when.getFullYear()}.{pad(when.getMonth() + 1)}.
                {pad(when.getDate())}
              </span>
              {solvedSolution ? (
                <MdDoneAll className={classes.solved} />
              ) : (
                <div className={classes.solved} />
              )}
              {best ? (
                <span className={classes.message}>
                  løst med {best.words.length} ord{" "}
                  {others ? `(${others} andre løsninger)` : null}
                </span>
              ) : (
                <span className={classes.message}>Ikke løst!</span>
              )}
            </Link>
          );
        },
      )}
    </div>
  );
};
