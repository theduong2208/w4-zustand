import { useState, useEffect, useMemo, useCallback } from "react";

interface VirtualGridOptions {
  totalItems: number;
  itemHeight: number; // Chiều cao ước lượng của mỗi card (px)
  gap: number;        // Khoảng cách giữa các items (px)
  overscan?: number;  // Số hàng render đệm trên/dưới để scroll mượt
}

export function useVirtualGrid({
  totalItems,
  itemHeight,
  gap,
  overscan = 2,
}: VirtualGridOptions) {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Tính số cột dựa trên responsive container width
  const columns = useMemo(() => {
    if (containerWidth < 640) return 1;
    if (containerWidth < 900) return 2;
    if (containerWidth < 1200) return 3;
    return 4;
  }, [containerWidth]);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(totalItems / columns);
  const totalHeight = totalRows * rowHeight;

  // Lắng nghe scroll & resize của window
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollTop(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      const mainEl = document.querySelector(".app-main");
      if (mainEl) {
        setContainerWidth(mainEl.clientWidth);
      } else {
        setContainerWidth(window.innerWidth);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial width check
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Tính hàng bắt đầu và kết thúc nằm trong viewport (có overscan)
  const { startIndex, endIndex, startRow, visibleRows } = useMemo(() => {
    // Ước lượng vị trí scroll tương đối so với grid container
    // Giả sử header & controls chiếm khoảng 220px
    const gridOffsetTop = 220;
    const effectiveScrollTop = Math.max(0, scrollTop - gridOffsetTop);

    const calculatedStartRow = Math.max(
      0,
      Math.floor(effectiveScrollTop / rowHeight) - overscan
    );

    const calculatedEndRow = Math.min(
      totalRows - 1,
      Math.ceil((effectiveScrollTop + viewportHeight) / rowHeight) + overscan
    );

    const start = calculatedStartRow * columns;
    const end = Math.min(totalItems, (calculatedEndRow + 1) * columns);

    return {
      startIndex: start,
      endIndex: end,
      startRow: calculatedStartRow,
      visibleRows: Math.max(0, calculatedEndRow - calculatedStartRow + 1),
    };
  }, [scrollTop, viewportHeight, rowHeight, overscan, totalRows, columns, totalItems]);

  const getItemStyle = useCallback(
    (index: number) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const top = row * rowHeight;
      const widthPercent = 100 / columns;

      return {
        position: "absolute" as const,
        top: `${top}px`,
        left: `calc(${col * widthPercent}% + ${col > 0 ? (gap / 2) : 0}px)`,
        width: `calc(${widthPercent}% - ${(gap * (columns - 1)) / columns}px)`,
        height: `${itemHeight}px`,
      };
    },
    [columns, rowHeight, gap, itemHeight]
  );

  return {
    columns,
    totalHeight,
    startIndex,
    endIndex,
    startRow,
    visibleRows,
    visibleCount: endIndex - startIndex,
    getItemStyle,
  };
}
