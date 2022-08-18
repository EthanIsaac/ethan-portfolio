import { SocialMediaContainer, SocialMediaItem } from './styles';

const SocialMedia = () => {
  return (
    <SocialMediaContainer>
      <SocialMediaItem href='https://www.linkedin.com/in/eibautistat/' target='_blank' rel='noopener noreferrer'>
        <img src='assets/images/social-media/linkedin-logo.png' />
      </SocialMediaItem>
      <SocialMediaItem href='https://www.linkedin.com/in/eibautistat/' target='_blank' rel='noopener noreferrer'>
        <img src='assets/images/social-media/github-logo.png' />
      </SocialMediaItem>
    </SocialMediaContainer>
  );
};

export default SocialMedia;
