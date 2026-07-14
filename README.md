# Client Project Tracker

Small React dashboard built for the Digidel Solutions assessment. It pulls clients from the JSONPlaceholder API, lets you search them, open a detail view with that client's projects, and add new projects through a validated form.

Live demo: https://client-project-tracker-two.vercel.app

## Running it locally

You need Node 18 or newer.

```bash
git clone https://github.com/sumitsrivastava9/client-project-tracker.git
cd client-project-tracker
npm install
npm run dev
```

`npm run build` creates the production build in `dist/`.

## How I approached it

I kept the stack small on purpose: Vite, React, TypeScript and CSS Modules, nothing else. It's one screen with two modals, so a router or a state library would just be extra weight to justify.

Data fetching goes through one small hook, `useFetch` (in `src/hooks/useFetch.ts`). It gives every request loading, error and retry states, and it aborts the request if the component unmounts or the URL changes, so a slow response can't come back later and overwrite newer data.

The detail view is a modal. I wrote one reusable `Modal` component and use it for both the client detail and the new project form. It closes on Escape or clicking the overlay, locks page scroll while open, and puts focus back where it was when it closes.

The form validates on submit: every field is required, and the deadline gets rejected if it's before today. I compare dates using local time rather than `toISOString()`, because that converts to UTC and near midnight it can call today "yesterday". The date input also has a `min` attribute so the browser greys out past dates, but the real check is in the code since `min` is easy to bypass.

New projects are stored in component state (the brief said no backend needed). When you add one, it shows up in that client's detail view with a "New" badge.

For responsiveness, the card grid uses `auto-fill` with `minmax` so it reflows on its own, and below 640px the toolbar stacks and the modals tighten up.

A few calls I made where the spec was open to interpretation:

- "Total clients" shows the full count, not the filtered count, because it says total.
- Today is a valid deadline. Only dates before today count as past.
- Avatar initials skip titles and suffixes, so "Mrs. Dennis Schulist" gets "DS" and "Nicholas Runolfsdottir V" gets "NR".

## The two bugs in the starter snippet

```jsx
function ClientCount({ clients }) {
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(clients.length) }, []);
  return <p>Total clients: {count}</p>;
}
// Rendered inside the client list, e.g: {clients.map(c => <li>{c.name}</li>)}
```

**Bug 1: the count never updates.** The effect has an empty dependency array, so it runs once after the first render and never again. Since the clients load from an API, the list is empty at that point, meaning the count gets stuck at 0 forever. Adding `clients` to the dependency array would fix it, but the deeper issue is that the count shouldn't be state at all. It can be worked out from the prop on every render, so my fixed version (`src/components/ClientCount.tsx`) just renders `clients.length` directly. No state and no effect means nothing can go stale.

**Bug 2: no `key` on the list items.** The `.map()` renders `<li>` elements without a `key` prop. React needs keys to tell which item is which between renders. Without them it falls back to position in the array, which goes wrong exactly when the list gets filtered or reordered, like this one does with search: state can end up attached to the wrong row and React does more re-rendering than it needs to. The fix is `key={c.id}`, which is how the list is rendered in `src/App.tsx`.

## Reflections

### AI tools

I used Claude Code for most of the hands-on work on this build. It scaffolded the project, wrote the first pass of the components and the CSS for the card spec, and helped draft this README. The decisions were mine: I picked Vite with TypeScript and CSS Modules, kept dependencies at zero, agreed the component split and the commit plan, and reviewed every change before it was committed. Where the spec left room for interpretation, like whether today counts as a past deadline, I made the call and noted it above. I tested the app myself at different widths, and also had it driven end to end with a Playwright script as a final check. I'm happy to walk through any file in this repo and explain why it's written the way it is.

### Client scenario: landing page in 3 days from a vague brief

With a vague brief and three days, the first job is making the brief less vague, fast. I'd get 30 minutes with the client the same day and pin down three things: what the page is for, who it's for, and the one action a visitor should take. Then I'd confirm the scope in writing: the sections I'll build, one round of feedback, and a deadline for copy and images, because content is what usually slips. Day one, I'd get a skeleton deployed to a staging link so the client watches progress instead of waiting for a big reveal. Day two is real content and responsive polish. Day three is their feedback and launch. Anything new that comes up mid-build goes on a post-launch list, not into the deadline.
