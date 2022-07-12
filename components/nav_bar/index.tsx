import { NavBarContainer, SectionsListContainer, SectionTitle } from "./styled";

const NavBar = ({ currentSection, sections, onTitleClick }) => {
  const variant = currentSection != 0;

  return (
    <NavBarContainer variant={variant}>
      <button onClick={() => onTitleClick(0)}>
        <img src="assets/images/coder.png"></img>
      </button>
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
