# Vihaan X Team Photos Directory

Welcome! This folder holds photos for the Vihaan X **Event Leads** and **Department Leads**.

## Folder Structure

```
public/team/
├── event-leads/
│   ├── lead-1.jpg
│   ├── lead-2.jpg
│   ├── lead-3.jpg
│   └── lead-4.jpg
│
├── dept-leads/
│   ├── dept-1.jpg
│   ├── dept-2.jpg
│   ├── ...
│   └── dept-14.jpg
│
├── placeholder-lead.svg
└── placeholder-dept.svg
```

## How to Add or Change Photos

1. **Event Leads (4 People):**
   - Save your photos in `public/team/event-leads/`.
   - By default, the website looks for:
     - `lead-1.jpg`
     - `lead-2.jpg`
     - `lead-3.jpg`
     - `lead-4.jpg`
   - You can use `.jpg`, `.jpeg`, `.png`, or `.webp`.
   - You can also edit names, roles, and image filenames in `src/data/team.js`.

2. **Department Leads (14 People):**
   - Save your photos in `public/team/dept-leads/`.
   - By default, the website looks for:
     - `dept-1.jpg` to `dept-14.jpg`
   - You can use `.jpg`, `.jpeg`, `.png`, or `.webp`.
   - You can configure custom paths, departments, names, and social links in `src/data/team.js`.

3. **Automatic Fallback:**
   - If an image has not been uploaded yet or fails to load, a stylish holographic cyber-astronaut placeholder is displayed automatically so the page always looks complete and polished!
