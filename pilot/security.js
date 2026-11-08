/** Safe HTML string escape where static templates are necessary. Prefer textContent for untrusted output. */
export const esc = (value)=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
