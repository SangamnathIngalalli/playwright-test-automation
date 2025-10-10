## Task 09: Implement Multi-tab / Window Testing  

### Goal  
- Automate scenarios that spawn or depend on multiple browser windows / tabs  
- Keep tests stable while switching, closing, or comparing data across contexts  

---

### Actions  
1. **Handle new window / tab events**  
   - Listen for `page.context().on('page', ...)` to grab references to pop-ups  

2. **Switch between windows / tabs**  
   - Store `Page` objects in an array or Map  
   - Use `page.bringToFront()` to shift focus  

3. **Interact with multiple windows simultaneously**  
   - Perform actions on any stored `Page` instance (clicks, fills, extracts)  

4. **Close specific windows**  
   - `await unwantedPage.close()` — then prune from collection  

5. **Verify data across windows**  
   - Read text/url from each `Page`, assert consistency  

6. **Test popup windows**  
   - Trigger action that opens popup, wait for `'page'` event, assert popup url/title  

7. **Handle window focus issues**  
   - Always `bringToFront()` before visual or keyboard actions  
   - Use `waitForLoadState()` after focus changes  

---

### Deliverable  
✅ Multi-window testing works  
✅ Window management handled  
✅ Complex scenarios covered  