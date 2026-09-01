---
title: Heirloom Read View — CSS 3D Flip Prototype
status: prototype
scope: implementation-a
stack: React + TypeScript + Vite + Framer Motion
---

# Product brief

Heirloom is a photo-forward memoir product. This prototype evaluates the feel, smoothness, and mobile behavior of a single-page read view using a hand-rolled CSS 3D page flip.

# User stories

- As a member, I can read a finished memoir one page at a time.
- As a member, I can advance or go back using visible buttons.
- As a member, I can drag horizontally to turn a page on touch or pointer devices.
- As a member, I can see which page I am reading.
- As a member, I can view text-only, photo-only, and mixed memoir pages.

# Functional requirements

- Render one page at a time in a single screen.
- Use CSS 3D perspective, preserve-3d, rotateY, and hidden backfaces.
- Animate flips with Framer Motion.
- Support next and previous buttons.
- Support horizontal drag gestures with threshold and velocity handling.
- Prevent overlapping flips.
- Show a page counter in the format "Page X of 12".
- Use approximately 12 pre-chunked mock page objects.

# Data model

Each mock page contains:

- pageNumber: number
- type: text | photo | mixed
- content: string
- imageUrl: optional image URL
- caption: optional string

# Out of scope

- react-pageflip implementation
- pagination or content splitting
- export or print
- authentication
- backend or persistence
- navigation, settings, or additional screens

# Implementation phases

## Phase 1 — Prototype foundation

Create the page model, mock pages, shared page content presentation, and read-view shell.

## Phase 2 — Flip interaction

Add CSS 3D page surfaces, Framer Motion animation, click controls, and drag gestures.

## Phase 3 — Mobile polish

Tune sizing, typography, touch behavior, backface visibility, spacing, and page counter for a 390px viewport.

## Phase 4 — Verification

Run production build and type checks, then verify the single-page flow and mobile viewport behavior.
