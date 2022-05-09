import { NavBarContainer, SectionsListContainer, SectionTitle } from './styled';

const NavBar = ({ currentSection, sections, onTitleClick }) => {
  const variant = currentSection != 0;

  return (
    <NavBarContainer variant={variant}>
      <img src="assets/images/coder.png"></img>
      <SectionsListContainer>
        {sections.map(({ title }: { title: string }, i: number) => (
          <SectionTitle
            key={`${i}`}
            variant={variant}
            active={currentSection === i}
            index={i}
            onClick={() => onTitleClick(i)}
          >
            {title}
          </SectionTitle>
        ))}
      </SectionsListContainer>
    </NavBarContainer>
  );
};

export default NavBar;
