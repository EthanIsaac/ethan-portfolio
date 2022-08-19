import { ContentContainer, Event, EventsContainer, Separator, TimelineContainer } from './styles';
import ReactTooltip from 'react-tooltip';
import useIsMobile from 'hooks/useIsMobile';
import { useState } from 'react';

interface IEvent {
  title: string;
  start: Date;
  end: Date;
  src: string;
  content: React.FC;
}

interface ITimelineProps {
  events: IEvent[];
}

const Timeline = ({ events }: ITimelineProps) => {
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);

  const Content = events[index].content;
  return (
    <TimelineContainer>
      {!isMobile && (
        <ContentContainer>
          <Content />
        </ContentContainer>
      )}
      <EventsContainer>
        {events.map(({ title, start, end, src, content }, i) => {
          return (
            <>
              <ReactTooltip
                id={`${i}-${src}`}
                type='warning'
                effect='solid'
                place={isMobile ? 'right' : 'top'}
                multiline
              >
                <div style={{ textAlign: 'center' }}>
                  <span>
                    <strong>{title}</strong>
                    <br />
                    <br />
                    {start.toLocaleDateString()}
                    <br />
                    -
                    <br />
                    {end.toLocaleDateString()}
                  </span>
                </div>
              </ReactTooltip>
              <Event data-tip data-for={`${i}-${src}`} src={src} onClick={() => setIndex(i)} />
              {i !== events.length - 1 && <Separator />}
            </>
          );
        })}
      </EventsContainer>
      {isMobile && (
        <ContentContainer>
          <Content />
        </ContentContainer>
      )}
    </TimelineContainer>
  );
};

export default Timeline;
