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

  const [items, setItems] = useState<
    {
      text: string;
      columnNumber: number;
      rowNumber: number;
      isDisplay: boolean;
      key: number;
    }[]
  >([]);

  const gridItemSize = 60, gridGap = 20, trunkThickness = 3;
  const [numColumns, setNumColumns] = useState(1);
  const [numRows, setNumRows] = useState(1);
  const onResize = () => {
    const newNumColumns = Math.floor(
        Math.max(((wrapperRef.current?.clientWidth ?? 0) - gridGap) / (gridItemSize + gridGap), 5)
      ),
      newNumRows = Math.floor(
        Math.max(((wrapperRef.current?.clientHeight ?? 0) - gridGap) / (gridItemSize + gridGap), 5)
      );
    const newItems = [];
    let displayCount = 0;

    for (let index = 0; index < newNumColumns * newNumRows; index++) {
      const columnNumber = (index % newNumColumns) + 1,
        rowNumber = Math.floor(index / newNumColumns) + 1;
      const horizontalCenterNumber = Math.floor((newNumColumns - 1) / 2) + 1;

      const isDisplay = (() => {
        if (rowNumber >= newNumColumns / 2 + 1)
          return (
            Math.abs(columnNumber - horizontalCenterNumber) <=
            Math.min(Math.ceil(newNumColumns / 2 - trunkThickness), 1)
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
    setNumRows(newNumRows);
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
        padding: "20px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: "#fff",
          padding: "20px",
          display: "grid",
          gridTemplate: `repeat(${numRows}, ${gridItemSize}px) / repeat(${numColumns}, ${gridItemSize}px)`,
          gridGap,
          alignContent: "start",
        }}
        ref={wrapperRef}
      >
        {items.map((item) => {
          if (item.isDisplay)
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
                }}
                key={item.key}
              >
                {item.text}
              </div>
            );
          else return undefined;
        })}
      </div>
    </div>
  );
};

export default App;
