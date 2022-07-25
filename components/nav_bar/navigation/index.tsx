import { SectionsListContainer, SectionTitle } from "./styles";

const Navigation = ({ variant, currentSection, sections, onTitleClick, closeMenu, isOpen }) => {
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
    </SectionsListContainer>
  );
};

export default Navigation;
