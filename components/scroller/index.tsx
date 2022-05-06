import { ReactNode, useEffect, useState } from 'react';
import { ScrollerContainer, ScrollSectionContainer } from './styled';

interface ScrollerProps {
  id: string;
  children: Array<ReactNode>;
  dragOffset?: number;
}

const Scroller = ({ id, children, dragOffset = 80 }: ScrollerProps) => {
  const [currentElement, setCurrentElement] = useState(0);
  const [container, setContainer] = useState<HTMLElement>(null);
  let preventScrollTimer: NodeJS.Timeout = null;
  let dragInitialPosition = 0;
  let touchInitialPosition = 0;

  const handleMouseUp = function (e) {
    container.onmouseup = null;

    const deltaY = e.clientY - dragInitialPosition;
    if (Math.abs(deltaY) > dragOffset) {
      if (deltaY > 0) {
        setCurrentElement((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setCurrentElement((prev) => (prev < children.length - 1 ? prev + 1 : children.length - 1));
      }
    }
  };

  const handleMouseDown = function (e) {
    dragInitialPosition = e.clientY;
    container.onmouseup = handleMouseUp;
  };

  const scrollToElement = (index: number) => {
    if (!container) return;
    const element = container.querySelector(`[data-scrolling-id="${id}-${index}"]`);

    console.log('element is ', element);
    if (element != null) {
      element.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      });
    }
  };

  const handletouchEnd = (e: TouchEvent) => {
    container.ontouchend = null;
    if (e.changedTouches.length != 1) {
      return;
    }

    const deltaY = e.changedTouches[0].clientY - touchInitialPosition;
    if (Math.abs(deltaY) > dragOffset) {
      if (deltaY > 0) {
        setCurrentElement((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setCurrentElement((prev) => (prev < children.length - 1 ? prev + 1 : children.length - 1));
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
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
      setCurrentElement((prev) => (prev < children.length - 1 ? prev + 1 : children.length - 1));
    } else {
      setCurrentElement((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key == 'ArrowUp') {
      setCurrentElement((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key == 'ArrowDown') {
      setCurrentElement((prev) => (prev < children.length - 1 ? prev + 1 : children.length - 1));
    }
  };

  useEffect(() => {
    scrollToElement(currentElement);
  }, [currentElement]);

  useEffect(() => {
    if (container) {
      window.onkeydown = handleKeyDown;
      container.onwheel = handleWheel;
      container.onmousedown = handleMouseDown;
      container.ontouchstart = handleTouchStart;
    }
  }, [container]);

  useEffect(() => {
    setContainer(document.getElementById(id));
  }, []);

  return (
    <ScrollerContainer id={id}>
      {children.map((e, i) => (
        <ScrollSectionContainer key={`${i}`} data-scrolling-id={`${id}-${i}`}>
          {e}
        </ScrollSectionContainer>
      ))}
    </ScrollerContainer>
  );
};

export default Scroller;
