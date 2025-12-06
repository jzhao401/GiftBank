# Sentiment Styling Reference

## Visual Guide to Comment Sentiment Styling

### Positive Comments
**Color Scheme:**
- Border: Green (#28a745)
- Background: Light green (#f1f9f3)
- Badge: Green with white text

**Example:**
```
┌─────────────────────────────────────────┐
│ 👤 John Doe          [POSITIVE]         │
│ November 1, 2024                        │
├─────────────────────────────────────────┤
│ I would like this! This looks amazing!  │
│ Great item! Exactly what I need!        │
└─────────────────────────────────────────┘
   ↑ Green left border (4px)
```

**Triggers positive sentiment:**
- Words like: amazing, love, great, perfect, excellent, fantastic
- Exclamation marks often indicate positive sentiment
- Enthusiastic phrases

### Negative Comments
**Color Scheme:**
- Border: Red (#dc3545)
- Background: Light red (#fdf4f5)
- Badge: Red with white text

**Example:**
```
┌─────────────────────────────────────────┐
│ 👤 David Lee         [NEGATIVE]         │
│ November 6, 2024                        │
├─────────────────────────────────────────┤
│ Condition doesn't look great from the   │
│ photos. Seems quite damaged.            │
└─────────────────────────────────────────┘
   ↑ Red left border (4px)
```

**Triggers negative sentiment:**
- Words like: terrible, bad, broken, damaged, disappointed
- Complaints or concerns
- Critical language

### Neutral Comments
**Color Scheme:**
- Border: Gray (#6c757d)
- Background: Light gray (#f8f9fa)
- Badge: Gray with white text

**Example:**
```
┌─────────────────────────────────────────┐
│ 👤 Jane Smith        [NEUTRAL]          │
│ November 2, 2024                        │
├─────────────────────────────────────────┤
│ Just DMed you. Hope it's still          │
│ available.                              │
└─────────────────────────────────────────┘
   ↑ Gray left border (4px)
```

**Triggers neutral sentiment:**
- Questions: "Is this available?"
- Informational: "Just DMed you"
- Factual statements without strong emotion

## CSS Classes Reference

### Comment Card Classes
- `.comment-card` - Base comment card
- `.comment-positive` - Applied to positive comments
- `.comment-negative` - Applied to negative comments
- `.comment-neutral` - Applied to neutral comments

### Sentiment Badge Classes
- `.sentiment-badge` - Base badge styling
- `.sentiment-positive` - Green badge
- `.sentiment-negative` - Red badge
- `.sentiment-neutral` - Gray badge

## Example HTML Structure

```html
<!-- Positive Comment -->
<div class="card mb-3 comment-card comment-positive">
  <div class="card-body">
    <div class="comment-header">
      <p class="comment-author">
        <strong>John Doe</strong>
        <span class="sentiment-badge sentiment-positive">
          positive
        </span>
      </p>
      <p class="comment-date">11/1/2024</p>
    </div>
    <p class="comment-text">I would like this! This looks amazing!</p>
  </div>
</div>

<!-- Negative Comment -->
<div class="card mb-3 comment-card comment-negative">
  <div class="card-body">
    <div class="comment-header">
      <p class="comment-author">
        <strong>David Lee</strong>
        <span class="sentiment-badge sentiment-negative">
          negative
        </span>
      </p>
      <p class="comment-date">11/6/2024</p>
    </div>
    <p class="comment-text">Condition doesn't look great from the photos.</p>
  </div>
</div>

<!-- Neutral Comment -->
<div class="card mb-3 comment-card comment-neutral">
  <div class="card-body">
    <div class="comment-header">
      <p class="comment-author">
        <strong>Jane Smith</strong>
        <span class="sentiment-badge sentiment-neutral">
          neutral
        </span>
      </p>
      <p class="comment-date">11/2/2024</p>
    </div>
    <p class="comment-text">Just DMed you. Hope it's still available.</p>
  </div>
</div>
```

## Interactive States

### Hover Effect
All comment cards have a hover effect:
- Slight lift (translateY -2px)
- Enhanced shadow
- Smooth transition (0.2s)

### Mobile Responsiveness
On screens < 768px:
- Comment header stacks vertically
- Date moves below author name
- Maintains full functionality

## Testing Sentiment Examples

### Test These Comments for Different Sentiments:

**Positive (Expected: Green):**
- "This is amazing! I love it!"
- "Perfect condition! Exactly what I needed!"
- "Wonderful gift! Thank you so much!"
- "Great product! Highly recommend!"

**Negative (Expected: Red):**
- "This looks terrible and broken."
- "Very disappointed with the condition."
- "Not as described. Looks damaged."
- "Poor quality. Wouldn't recommend."

**Neutral (Expected: Gray):**
- "Is this still available?"
- "Can you provide more details?"
- "What's the shipping cost?"
- "Where are you located?"

## Accessibility Considerations

1. **Color Contrast**: All text maintains WCAG AA standards
2. **Semantic HTML**: Proper card and header structure
3. **Clear Labels**: Sentiment badges clearly labeled
4. **Keyboard Navigation**: All interactive elements are keyboard accessible

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- CSS uses efficient transforms for animations
- Color variables could be extracted for theming
- Minimal JavaScript for sentiment display
- Comments load efficiently with single API call
