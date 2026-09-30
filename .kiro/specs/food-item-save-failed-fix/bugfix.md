# Bugfix Requirements Document

## Introduction

When an admin attempts to create or update a food item via the `Addfooditem.jsx` form,
the request fails with the toast error **"Food item save failed — Please verify the API
payload and try again"**. The root cause is a structural mismatch in the JSON payload
sent to the Spring Boot backend: the frontend serialises the category relationship as a
flat numeric field (`categoryId: 5`), while the Spring Boot JPA entity expects a nested
object (`category: { id: 5 }`) to correctly resolve the `@ManyToOne` relationship.
Secondary mismatches — such as a missing or incorrect `Content-Type` header, unexpected
`null` vs. absent fields for optional discount data, or type coercion issues — may also
contribute to the 400/500 responses returned by the backend.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user submits the food item form (create or update) with a valid category
    selection THEN the system sends `categoryId: <number>` as a top-level field in the
    JSON payload, causing the Spring Boot endpoint to reject the request with a 400 or
    500 error response.

1.2 WHEN the backend rejects the payload THEN the system displays the toast
    "Food item save failed / Please verify the API payload and try again" and the food
    item is not persisted.

1.3 WHEN a user submits the form without selecting a discount type THEN the system
    includes `discountType: null` and `discountValue: null` in the payload, which may
    cause unexpected validation or deserialization errors on the backend if those fields
    are not explicitly nullable in the Spring Boot DTO.

1.4 WHEN a user edits an existing food item that was originally saved with a nested
    `category` object THEN the system reads `item.category?.id` for the form pre-fill
    but still serialises the update payload with the flat `categoryId` field, so the
    update request fails with the same structural mismatch.

### Expected Behavior (Correct)

2.1 WHEN a user submits the food item form with a valid category selection THEN the
    system SHALL serialise the category as a nested object `category: { id: <number> }`
    in the outgoing JSON payload so that the Spring Boot JPA entity can resolve the
    relationship.

2.2 WHEN the backend accepts the corrected payload THEN the system SHALL persist the
    food item, dismiss the form, refresh the food item list, and show the appropriate
    success toast ("Food item created successfully" or "Food item updated successfully").

2.3 WHEN a user submits the form without selecting a discount type THEN the system
    SHALL omit `discountType` and `discountValue` from the payload entirely (or send
    them as `null` only if the backend DTO explicitly supports nullable discount fields)
    so that no unnecessary validation error is triggered.

2.4 WHEN a user edits an existing food item THEN the system SHALL pre-fill the category
    field correctly from `item.category?.id ?? item.categoryId` AND serialise the update
    payload with the nested `category: { id: <number> }` structure, ensuring both the
    read path and the write path are consistent.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user fills in all required fields with valid values and a non-empty category
    THEN the system SHALL CONTINUE TO validate the form client-side before making any
    network request, showing field-level error toasts for missing or invalid inputs.

3.2 WHEN the backend returns a descriptive error message in `error.response.data.message`
    THEN the system SHALL CONTINUE TO surface that message in the failure toast rather
    than the generic fallback text.

3.3 WHEN a user selects a discount type and provides a discount value THEN the system
    SHALL CONTINUE TO include `discountType` and `discountValue` in the payload with the
    correct types (string enum and number respectively).

3.4 WHEN a user clicks "Reset" or "Add Food Item" THEN the system SHALL CONTINUE TO
    clear the form back to its default empty state without triggering any API call.

3.5 WHEN a food item is successfully deleted THEN the system SHALL CONTINUE TO remove
    it from the displayed list and show the delete success toast, independent of the
    save-payload fix.

3.6 WHEN the food item list is fetched via `GET /fooditems/getdata` THEN the system
    SHALL CONTINUE TO display all returned items with their category names resolved from
    either `item.category.id` or `item.categoryId`.

---

## Bug Condition Pseudocode

```pascal
FUNCTION isBugCondition(payload)
  INPUT: payload of type FoodItemPayload
  OUTPUT: boolean

  // Bug is triggered when categoryId is sent as a flat top-level number
  // instead of a nested category object
  RETURN payload.categoryId IS NOT NULL
     AND payload.category IS NULL
END FUNCTION
```

```pascal
// Property: Fix Checking — nested category object is sent
FOR ALL payload WHERE isBugCondition(payload) DO
  correctedPayload ← applyFix(payload)
  ASSERT correctedPayload.category = { id: payload.categoryId }
  ASSERT correctedPayload.categoryId IS ABSENT
END FOR
```

```pascal
// Property: Preservation Checking — non-category fields are unchanged
FOR ALL payload WHERE NOT isBugCondition(payload) DO
  ASSERT F(payload) = F'(payload)
END FOR
```
