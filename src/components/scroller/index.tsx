import { useCallback, useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import { ContentContainer, ScrollerContainer, ScrollSectionContainer } from "./styled";

interface ScrollerProps {
  id: string;
  dragOffset?: number;
  currentSection: number;
  onSectionChange?: (section: number) => void;
  sections: Array<{
    title: string;
    Component: () => JSX.Element;
    cameraPosition: [number, number, number];
  }>;
}

const Scroller = ({ id, currentSection, dragOffset = 80, onSectionChange, sections }: ScrollerProps) => {
  const [container, setContainer] = useState<HTMLElement>(null);
  const isMobile = useIsMobile();
  let preventScrollTimer: NodeJS.Timeout = null;
  let dragInitialPosition = 0;
  let touchInitialPosition = 0;

  const nextElement = useCallback(() => {
    if (currentSection < sections.length - 1) {
      onSectionChange(currentSection + 1);
    } else {
      onSectionChange(sections.length - 1);
    }
  }, [currentSection]);

  const previousElement = useCallback(() => {
    if (currentSection > 0) {
      onSectionChange(currentSection - 1);
    } else {
      onSectionChange(0);
    }
  }, [currentSection]);

  const handleMouseUp = function (e) {
    container.onmouseup = null;

    const deltaY = e.clientY - dragInitialPosition;
    if (Math.abs(deltaY) > dragOffset) {
      if (deltaY > 0) {
        previousElement();
      } else {
        nextElement();
      }
    }
  };

  const handleMouseDown = function (e) {
    dragInitialPosition = e.clientY;
    container.onmouseup = handleMouseUp;
  };

  const handletouchEnd = (e: TouchEvent) => {
    container.ontouchend = null;
    if (e.changedTouches.length != 1) {
      return;
    }

    const deltaY = e.changedTouches[0].clientY - touchInitialPosition;
    if (Math.abs(deltaY) > dragOffset) {
      if (deltaY > 0) {
        previousElement();
      } else {
        nextElement();
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    touchInitialPosition = e.touches[0].clientY;
    container.ontouchend = handletouchEnd;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (preventScrollTimer != null) {
      return;
    }
    preventScrollTimer = setTimeout(() => (preventScrollTimer = null), 500);
    if (e.deltaY > 0) {
      nextElement();
    } else {
      previousElement();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      previousElement();
    } else if (e.key == "ArrowDown") {
      e.preventDefault();
      nextElement();
    }
  };

  useEffect(() => {
    if (container && !isMobile) {
      window.onkeydown = handleKeyDown;
      container.onwheel = handleWheel;
      container.onmousedown = handleMouseDown;
      container.ontouchstart = handleTouchStart;
      return () => {
        window.onkeydown = null;
        container.onwheel = null;
        container.onmousedown = null;
        container.ontouchstart = null;
      };
    }
  }, [container, currentSection, isMobile]);

  useEffect(() => {
    setContainer(document.getElementById(id));
  }, []);

  const Comp = sections[currentSection].Component;

  return (
    <ScrollerContainer className={"no-select"} id={id}>
      <ContentContainer>
        {isMobile ? (
          sections.map(({ Component }, i) => (
            <ScrollSectionContainer id={`section-${i}`} key={`${i}`} data-scrolling-id={`${id}-${i}`}>
              <Component />
            </ScrollSectionContainer>
          ))
        ) : (
          <ScrollSectionContainer>
            <Comp />
          </ScrollSectionContainer>
        )}
      </ContentContainer>
    </ScrollerContainer>
  );
};

export default Scroller;
