import { SocialMediaContainer, SocialMediaItem } from './styles';

const SocialMedia = () => {
  return (
    <SocialMediaContainer>
      <SocialMediaItem href='https://www.linkedin.com/in/eibautistat/' target='_blank' rel='noopener noreferrer'>
        <img src='assets/images/social-media/linkedin-logo.png' alt='LinkedIn' />
      </SocialMediaItem>
      <SocialMediaItem href='https://www.linkedin.com/in/eibautistat/' target='_blank' rel='noopener noreferrer'>
        <img src='assets/images/social-media/github-logo.png' alt='Github' />
      </SocialMediaItem>
      <SocialMediaItem href='https://www.instagram.com/ethanisaac96/' target='_blank' rel='noopener noreferrer'>
        <img src='assets/images/social-media/instagram-logo.webp' alt='Instagram' />
      </SocialMediaItem>
      <SocialMediaItem href='https://discord.gg/zZZSyhetuU' target='_blank' rel='noopener noreferrer'>
        <img src='assets/images/social-media/discord-logo.png' alt='Discord' />
      </SocialMediaItem>
    </SocialMediaContainer>
  );
};

export default SocialMedia;
