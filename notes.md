## Lessons learnt

- You can request for additioanl provider oauth scope on Supabase in order to delete repositories
- GitHub default per_page parameter is 30, that's why initially we only get 30 repositories even thought I had a lot more repositories than that. To get all the repositories, I had to iterate through the pages to get all the repositories.
