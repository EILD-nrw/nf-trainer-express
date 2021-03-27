# NF-Trainer
The NF-Trainer is a learning application for transforming database tables into certain normal forms. The application was originally build by the [Cologne University of Applied Sciences](https://www.th-koeln.de/) as part of the online learning platform [edb](https://edb2.gm.th-koeln.de/index) and is now maintained as part of the EILD.nrw project, which aims to unify and improve the quality and reusability of database lectures and resources. 

This tool is currently a docker-based express server with an included postgres-database. It is written in JavaScript and uses Pug as its templating engine. 

A SCORM / LTI version is currently planned as well.

**Further information**
- [EILD.nrw Information (German)](https://medien.hs-duesseldorf.de/personen/rakow/Seiten/09062020_EILD.aspx?RootFolder=%2Fpersonen%2Frakow%2FPublishingImages%2FMeldungen&FolderCTID=0x0120004A9137CD4CD45345B9F581109987E838&View=%7BC6A3F1CE-FF3B-4025-A149-D6A910C2E30B%7D#:~:text=NRW%20zur%20Erstellung%20von%20offenen,schafft%20sich%20ihre%20Werkzeuge%20selbst.)
- [EILD.nrw GitHub](https://github.com/EILD-nrw)

-----

### Usage

- Download or clone the repo
- (Optional) Configure the `docker-compose.yml`
- Build the docker containers using `docker-compose build`
- Start the containers using `docker-compose up`

Note that the database will initialize itself using the `data.sql` file upon its first startup. Please wait until the initialization is complete before trying to access the server.

