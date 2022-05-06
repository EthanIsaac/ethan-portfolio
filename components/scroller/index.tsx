import { ReactNode, useEffect, useState } from 'react';

interface ScrollerProps {
  id: string;
  vertical?: boolean;
  offsetToChange?: number;
  children: Array<ReactNode>;
}

const Scroller = ({ id, children, vertical, offsetToChange = 200 }: ScrollerProps) => {
  const [currentElement, setCurrentElement] = useState(0);
  let lastScrollPosition = 0;

  const scrollToElement = (index: number) => {
    const container = document.getElementById(id);

    const element = container.querySelector(`[data-scrolling-id="${index}"]`);

    console.log(element);

    if (element != null) {
      console.log('GOING TO SOMETHING');
      window.removeEventListener('scroll', handleScroll);
      element.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = (e: Event) => {
    e.preventDefault();
    const offset = lastScrollPosition - window.scrollY;

    if (Math.abs(offset) >= offsetToChange) {
      if (offset > 0) {
        setCurrentElement((prev) => (prev + 1) % children.length);
      } else {
        setCurrentElement((prev) => (prev - 1) % children.length);
      }
      lastScrollPosition = window.scrollY;
    }
  };

  useEffect(() => {
    scrollToElement(currentElement);
  }, [currentElement]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id={id}>
      {children.map((e, i) => (
        <div id={`${i}`} data-scrolling-id={`${i}`}>
          {e}
        </div>
      ))}
    </div>
  );
};

export default Scroller;
