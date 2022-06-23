# jdbot
a bot by day, for jd~!

## features:
- [x] base discord bot
- [x] basic random reward system :>
	- [ ] make it a reasonable probability .\_.
- [ ] possible negative outcome?
- [x] possible *so close* effect?
	- currently, if you roll numbers 1 apart, you can roll again :>


## howto:
uses: node & npm  
https://nodejs.org/en/download/
1. run `npm i`
2. run `tsc`  
everything should be generated :D
3. login to discord on your browser and go to https://discord.com/developers/applications and create a new app
4. go to bot settings and creat a new bot
5. move file 'auth.json' outside directory and replace `TOKEN_HERE` with bot token
6. to start, run `node ./built/index.js`