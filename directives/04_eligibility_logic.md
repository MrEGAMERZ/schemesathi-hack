# Directive: Eligibility Check Logic

## Objective
Deterministically check if a user is eligible for a specific government scheme.

## Inputs
```json
{
  "schemeId": "string",
  "age": "number",
  "gender": "string (male/female/any)",
  "income": "number (annual in INR)",
  "state": "string",
  "occupation": "string"
}
```

## Logic (in `Backend/controllers/eligibilityController.js`)
1. Fetch scheme from Firestore by `schemeId`
2. Compare each eligibility field:
   - `age >= eligibility.min_age && age <= eligibility.max_age`
   - `gender matches eligibility.gender (or eligibility.gender === 'any')`
   - `income <= eligibility.income_limit (0 means no limit)`
   - `eligibility.state === 'all' || eligibility.state === userState`
   - `eligibility.occupation === 'any' || matches user occupation`
3. Collect failed conditions → build reason string
4. Return:

```json
{
  "eligible": true/false,
  "reason": "string explanation",
  "required_documents": ["Aadhaar", "..."]
}
```

## Edge Cases
- Unknown scheme ID: return 404
- Missing fields: return 400 with field name
- income_limit = 0: skip income check (no restriction)
- state = "all": skip state check
