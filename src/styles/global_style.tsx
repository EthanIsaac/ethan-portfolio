import { blurIn, blurOut } from '../animations/blur';
import { mobileCss } from '../utils/constants/responsiveness';
import { League_Spartan } from 'next/font/google';
import { Interpolation, Theme } from '@mui/material';

const leagueSpartan = League_Spartan({ subsets: ['latin'] });

const GlobalStyle: Interpolation<Theme> = (theme) => `
html,
body {
	height: 100dvh;
	padding: 0;
	margin: 0;
	color: white;
	font-weight: 400;
	font-family: ${leagueSpartan.style.fontFamily};

	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;  /* Firefox */
	::-webkit-scrollbar {
		display: none;
	}
	.no-select {
		-webkit-touch-callout: none; /* iOS Safari */
			-webkit-user-select: none; /* Safari */
			 -khtml-user-select: none; /* Konqueror HTML */
				 -moz-user-select: none; /* Old versions of Firefox */
					-ms-user-select: none; /* Internet Explorer/Edge */
							user-select: none; /* Non-prefixed version, currently
																		supported by Chrome, Edge, Opera and Firefox */
	}

	${blurIn}
	${blurOut}
}
`;

export default GlobalStyle;
