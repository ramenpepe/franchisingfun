export const getFlow = (context, example) => {
    return {
      role: 'user',
      content: `
        Interpret the product lifecycle into a flowchart based on the provided data: ${JSON.stringify(context)}.
        - Follow this example format: ${JSON.stringify(example)}.
        - Use these node types:
          - **Action**: Represents events or operations.
          - **Condition**: Only "DVP", "FIXING", and "Pending Payment".
          - **Account**: Parties involved.
        - Ensure logical node connections and avoid cross-links.
        - Do not orphan any nodes.
  
        ### Node Rules:
        1. Start with a single **startNode** (e.g., "FCN").
        2. **ConditionNode** must lead to an **ActionNode** or another **ConditionNode**.
        3. **ActionNode** should connect logically to other **ActionNode** or **AccountNode**.
        4. **AccountNode** indicates entity interaction and should only connect to an **ActionNode**.
  
        ### Example Flow:
        - **StartNode (FCN)** ➔ **ConditionNode (DVP Conditions)** ➔ 
          - **ActionNode (Void and Refund)** ➔ **AccountNode (Issuer)**
          - **ActionNode (DVP)** ➔ **ConditionNode (Periodic Fixing)** ➔ 
            - **ActionNode (Coupon Payment)** ➔ **ConditionNode (Pending Payment)** ➔ 
              - **ActionNode (Release Payment)** ➔ **AccountNode (Investor)**
  
        Return valid JSON formatted as a Markdown code block (\`\`\`json ... \`\`\`).
      `
    };
  };
  
  
  export const getParameters = () => {
    return {
      role: 'user',
      content: `
        Extract all relevant financial parameters and dates from the given termsheet context.
        - **Interest Rates**: Extract as floating-point values, omit currency symbols or percentage signs.
        - **Coupon Payment Dates**: Provide as separate entries for each payment in the format "coupon #1 - dd-mm-yyyy", "coupon #2 - dd-mm-yyyy", etc.
        - **Cycle Periods and Calendar Type**: Include details affecting scheduling or calculation.
        - **Conditions**: Extract and format into separate key-value pairs if there are multiple conditions.
        
        The output should be in a valid JSON format, structured as an array of key-value pairs.
        - Each entry should have a unique key.
        - If multiple values exist for a parameter, separate them into individual entries (e.g., "coupon payment date #1", "coupon payment date #2").
  
        Response format:
        \`\`\`json
        [
          { "key": "interest rate", "value": "3.5" },
          { "key": "coupon payment date #1", "value": "15-03-2025" },
          { "key": "coupon payment date #2", "value": "15-09-2025" },
          ...
        ]
        \`\`\`
      `
    };
  };
  