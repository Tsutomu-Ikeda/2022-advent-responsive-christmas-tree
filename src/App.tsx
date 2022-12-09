import { useEffect, useRef, useState } from "react";

const App: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const weWishYouAMerryChristmas = ["We", "wish", "you", "a", "Merry", "X'mas"];
  const andAHappyNewYear = ["and", "a", "Happy", "New", "Year"];
  const christmasSongLyrics = [
    ...weWishYouAMerryChristmas,
    ...weWishYouAMerryChristmas,
    ...weWishYouAMerryChristmas,
    ...andAHappyNewYear,
  ];

  const [items, setItems] = useState<{
    text: string;
    columnNumber: number;
    rowNumber: number;
    isDisplay: boolean;
    key: number;
  }[]>([]);

  const [numColumns, setNumColumns] = useState(1);
  const [maxNumRows, setMaxNumRows] = useState(1);

  const onResize = () => {
    const newNumColumns = Math.floor(
        Math.max(((wrapperRef.current?.clientWidth ?? 0) - 20) / (60 + 20), 5)
      ),
      newMaxNumRows = Math.floor(
        Math.max(((wrapperRef.current?.clientHeight ?? 0) - 20) / (60 + 20), 5)
      );
    const newItems = [];
    let displayCount = 0;

    for (let index = 0; index < newNumColumns * newMaxNumRows; index++) {
      const columnNumber = (index % newNumColumns) + 1,
        rowNumber = Math.floor(index / newNumColumns) + 1;
      const horizontalCenterNumber = Math.floor((newNumColumns - 1) / 2) + 1;

      const isDisplay = (() => {
        if (rowNumber >= newNumColumns / 2 + 1)
          return (
            Math.abs(columnNumber - horizontalCenterNumber) <=
            Math.min(Math.ceil(newNumColumns / 2 - 3), 1)
          );

        return Math.abs(columnNumber - horizontalCenterNumber) < rowNumber;
      })();

      newItems.push({
        text: christmasSongLyrics[displayCount % christmasSongLyrics.length],
        columnNumber,
        rowNumber,
        isDisplay,
        key: index + 1,
      });

      if (isDisplay) displayCount++;
    }

    setNumColumns(newNumColumns);
    setMaxNumRows(newMaxNumRows);
    setItems(newItems);
  };
  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      style={{
        width: "calc(100vw - 20px * 2 - 20px * 2)",
        height: "calc(100vh - 20px * 2 - 20px * 2)",
        backgroundColor: "#fff",
        justifyContent: "start",
        verticalAlign: "top",
        margin: "20px",
        padding: "20px",
        display: "grid",
        gridTemplateColumns: `repeat(${numColumns}, 60px)`,
        gridTemplateRows: `repeat(${maxNumRows}, 60px)`,
        gridGap: "20px 20px",
      }}
      ref={wrapperRef}
    >
      {items.map((item) => {
        return (
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#1b8a2c",
              color: "#1b8a2c",
              display: "flex", // テキストの中央揃え用のflex
              alignItems: "center",
              justifyContent: "center",
              gridColumn: item.columnNumber,
              gridRow: item.rowNumber,
              opacity: item.isDisplay ? 1 : 0,
            }}
            key={item.key}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

export default App;
