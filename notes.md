## Lessons learnt

- You can request for additioanl provider oauth scope on Supabase in order to delete repositories
- GitHub default per_page parameter is 30, that's why initially we only get 30 repositories even thought I had a lot more repositories than that. To get all the repositories, I had to iterate through the pages to get all the repositories.
- Somehow supabase client does not work properly to get the user's session, so I had to pass the provider token manually from server side to the client to the API routes.
- A nice article by Josh w Comeau on [refreshing server side rendered props](https://www.joshwcomeau.com/nextjs/refreshing-server-side-props/)