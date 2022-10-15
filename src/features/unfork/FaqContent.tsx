const FaqContent = (
  <blockquote className="pl-5">
    <ul className="list-outside list-disc">
      <li>
        <p className="font-bold">What does Unfork do?</p>
        <ul className="list-circle list-outside pl-5">
          <li>Delete forks and repos easily with a few clicks.</li>
        </ul>
      </li>
      <li>
        <p className="font-bold">Why use Unfork?</p>
        <ul className="list-circle list-outside pl-5">
          <li>
            It is estimated that Unfork can help you to save your search and
            operation time by ~5mins for every 1 repo you want to delete.
          </li>
          <li>
            With Unfork, you get to see all your repos instantly. You can see
            your repos sorted by whether they are forked or created by you, or
            sort them by the last push date to determine at a glance whether to
            keep the repo or not.
          </li>
          <li>
            If you try to delete 1 repo manually on GitHub, you need to go to
            the repo page directly, go through 2FA, type the repo&#39;s name and
            then click confirm button.
          </li>
          <li>
            If you have many repos that you want to delete, the manual process
            above will be very tedious, especially with GitHub&#39;s paginated
            UI.
          </li>
        </ul>
      </li>
      <li>
        <p className="font-bold">How do I restore my deleted projects?</p>
        <ul className="list-circle list-outside pl-5">
          <li>
            Please refer to the GitHub documentation on restoring your deleted
            projects. You may only restore projects that are deleted in the last
            90 days.
          </li>
        </ul>
      </li>
      <li>
        <p className="font-bold">
          How do I detach my forks instead of deleting them?
        </p>
        <ul className="list-circle list-outside  pl-5">
          <li>
            At the moment, there&#39;s no easy way of detaching a fork. You have
            to contact GitHub&#39;s support (
            <a
              href="https://stackoverflow.com/questions/29326767/unfork-a-github-fork-without-deleting/41486339#41486339"
              className="text-orange"
            >
              Reference
            </a>
            )
          </li>
        </ul>
      </li>
    </ul>
  </blockquote>
);

export default FaqContent;
