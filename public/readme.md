# Web Games Development Repo

## How to install Phaser/ Xampp
It seems the you can run Phaser without XAMPP by just opening the `index.html` however this won't be the case for multiplayer.
1. Install [xampp](https://www.apachefriends.org/index.html). This hosts a local server to run phaser on.
2. Dump the repo inside; `.../xampp/htdocs/<yourfolder>/`
3. Open `xampp-control.exe` and hit **Start** on the Apache module.
4. You can now view the game under `http://localhost/<yourfolder>/index.html`

## File Structure
- Index.html is essentially the main
- **doc** folder holds the library (ie phaser)
- **img** holds images, duh.
- **js** holds the javascript files
- **css** holds the css of the project