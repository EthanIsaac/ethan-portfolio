import useIsMobile from 'hooks/useIsMobile';
import SocialMedia from '../social_media';
import { SectionsListContainer, SectionTitle } from './styles';

const Navigation = ({ variant, currentSection, sections, onTitleClick, closeMenu, isOpen }) => {
  const isMobile = useIsMobile();
  return (
    <SectionsListContainer isOpen={isOpen}>
      {sections.map(({ title }: { title: string }, i: number) => (
        <SectionTitle
          key={`${i}`}
          variant={variant}
          active={currentSection === i}
          index={i}
          onClick={() => {
            onTitleClick(i);
            closeMenu();
          }}
        >
          {title}
        </SectionTitle>
      ))}
      {isMobile && <SocialMedia />}
    </SectionsListContainer>
  );
};

export default Navigation;
