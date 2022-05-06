import { ReactNode, useEffect, useState } from 'react';
import {
  ScrollableSection,
  ScrollerContainer,
  ScrollSectionContainer,
  SectionsListContainer,
  SectionTitle,
} from './styled';

interface ScrollerProps {
  id: string;
  dragOffset?: number;
  onSectionChange?: (section: number) => void;
  sections: Array<{
    title: string;
    component: ReactNode;
  }>;
}

const Scroller = ({ id, dragOffset = 80, onSectionChange, sections }: ScrollerProps) => {
  const [currentElement, setCurrentElement] = useState(0);
  const [container, setContainer] = useState<HTMLElement>(null);
  let preventScrollTimer: NodeJS.Timeout = null;
  let dragInitialPosition = 0;
  let touchInitialPosition = 0;

  const nextElement = () => {
    setCurrentElement((prev) => (prev < sections.length - 1 ? prev + 1 : sections.length - 1));
  };
  const previousElement = () => {
    setCurrentElement((prev) => (prev > 0 ? prev - 1 : 0));
  };

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

  const scrollToElement = (index: number) => {
    if (!container) return;
    const element = container.querySelector(`[data-scrolling-id="${id}-${index}"]`);

    if (element != null) {
      onSectionChange(index);
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
        previousElement();
      } else {
        nextElement();
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
      nextElement();
    } else {
      previousElement();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == 'ArrowUp') {
      e.preventDefault();
      previousElement();
    } else if (e.key == 'ArrowDown') {
      e.preventDefault();
      nextElement();
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
      <SectionsListContainer>
        {sections.map(({ title }, i) => (
          <SectionTitle key={`${i}`} index={i} onClick={() => setCurrentElement(i)}>
            {title}
          </SectionTitle>
        ))}
      </SectionsListContainer>
      <ScrollableSection>
        {sections.map(({ component }, i) => (
          <ScrollSectionContainer key={`${i}`} data-scrolling-id={`${id}-${i}`}>
            {component}
          </ScrollSectionContainer>
        ))}
      </ScrollableSection>
    </ScrollerContainer>
  );
};

export default Scroller;
