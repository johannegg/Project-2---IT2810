# Running the E2E-tests Locally

Unfortunately, there are a few steps that has to be done in order to run the tests locally. This is generally **not necessary**, but if you wish to run **all** tests, follow this guide.

**Step 1:**  
Change the name of `playlist.cy.skip.ts` to `playlist.cy.ts`.

**Step 2:**  
Go into all the specs, and follow the directions there to change the links from testing on VM to testing locally.

- favorite.cy.ts
- filter.cy.ts
- navigation.cy.ts
- playlist.cy.ts
- search.cy.ts
- sorting.cy.ts
- viewSong.cy.ts

**Step 3:**
You now need to change the file `prosjekt2/frontend/src/apollo/client.ts`, from using line 5 to using line 6. 

**Step 4:**  
Start up the frontend. Open a terminal and write  
`cd prosjekt2/frontend`  
`npm install`  
`npm run dev`

**Step 5:**  
Now you are ready to run the actual tests. Open a new terminal and write  
`cd prosjekt2/backend/e2e`  
`npx cypress open`

A popupwindow will show up. Here you should choose E2E Testing and then Start E2E Testing in Chrome.

**NOTE:** In some cases, the tests don't work due it not finding the localhost. If this happens, close all terminals and restart the process. If the network-connection is slow, you might have to wait a bit to open the tests after you open the frontend and backend.
