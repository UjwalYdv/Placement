
# AI Agent Workflow Log

## Project: FuelEU Maritime Compliance Platform

### Agents Used

1. **Claude Code (Anthropic)** - Primary agent for full-stack architecture
2. **GitHub Copilot** - Code completion and boilerplate generation
3. **Cursor Agent** - Refactoring and code organization

---

## Prompts & Outputs

### Example 1: Domain Model Generation

**Prompt:**
```
Create TypeScript domain models for FuelEU Maritime compliance system including:
- Route entity with ghgIntensity, fuelConsumption, emissions
- ComplianceBalance calculation
- Banking and Pooling entities following Hexagonal Architecture
```

**Output:**
```typescript
export interface Route {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGCO2eq: number;
  targetIntensity: number;
  actualIntensity: number;
  energyInScope: number;
}
```

**Validation:** Manually verified against FuelEU specification. Added missing fields like `distance` and `totalEmissions`.

---

### Example 2: Use Case Implementation

**Prompt:**
```
Implement ComputeComplianceBalanceUseCase that:
- Takes actualIntensity and fuelConsumption as inputs
- Uses TARGET_INTENSITY_2025 = 89.3368 gCO2e/MJ
- Calculates CB = (Target - Actual) × Energy in scope
- Energy = fuelConsumption × 41000 MJ/t
```

**Output:**
```typescript
export class ComputeComplianceBalanceUseCase {
  execute(
    shipId: string,
    year: number,
    actualIntensity: number,
    fuelConsumption: number
  ): ComplianceBalance {
    const targetIntensity = COMPLIANCE_CONSTANTS.TARGET_INTENSITY_2025;
    const energyInScope = fuelConsumption * COMPLIANCE_CONSTANTS.ENERGY_CONVERSION_FACTOR;
    const cbGCO2eq = (targetIntensity - actualIntensity) * energyInScope;

    return {
      shipId,
      year,
      cbGCO2eq,
      targetIntensity,
      actualIntensity,
      energyInScope,
    };
  }
}
```

**Correction:** Initially forgot to multiply by energy conversion factor. Added constant `ENERGY_CONVERSION_FACTOR = 41000`.

---

### Example 3: Pooling Algorithm

**Prompt:**
```
Implement greedy allocation algorithm for pooling that:
1. Sorts members by CB descending (surplus first)
2. Transfers surplus to deficits
3. Validates: deficit ships don't exit worse, surplus ships don't go negative
```

**Output:**
```typescript
private allocatePool(members: Array<{ shipId: string; cbBefore: number }>) {
  const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
  const allocated = sorted.map(m => ({
    shipId: m.shipId,
    cbBefore: m.cbBefore,
    cbAfter: m.cbBefore,
  }));

  for (let i = 0; i < allocated.length; i++) {
    if (allocated[i].cbAfter > 0) {
      for (let j = allocated.length - 1; j > i; j--) {
        if (allocated[j].cbAfter < 0) {
          const transfer = Math.min(allocated[i].cbAfter, -allocated[j].cbAfter);
          allocated[i].cbAfter -= transfer;
          allocated[j].cbAfter += transfer;
          if (allocated[i].cbAfter === 0) break;
        }
      }
    }
  }
  return allocated;
}
```

**Refinement:** Added validation step to check constraints after allocation.

---

### Example 4: React Hooks for Data Fetching

**Prompt:**
```
Create React hooks using Hexagonal Architecture:
- useRoutes: fetch routes with filters, set baseline
- useComparison: fetch baseline and comparison data
- useBanking: bank surplus, apply banked
- usePooling: create pool with members
```

**Output (useRoutes):**
```typescript
export const useRoutes = (filters?: {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, [filters?.vesselType, filters?.fuelType, filters?.year]);

  const fetchRoutes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeService.getAllRoutes(filters);
      setRoutes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { routes, loading, error, refetch: fetchRoutes };
};
```

**Correction:** Added proper TypeScript types and error handling.

---

### Example 5: Database Migrations

**Prompt:**
```
Create PostgreSQL migrations for:
- routes table with all fields
- ship_compliance table
- bank_entries table
- pools and pool_members tables
Include seed data from assignment
```

**Output:**
```typescript
await client.query(`
  CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) UNIQUE NOT NULL,
    vessel_type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    ghg_intensity DECIMAL(10, 4) NOT NULL,
    fuel_consumption DECIMAL(12, 2) NOT NULL,
    distance DECIMAL(10, 2) NOT NULL,
    total_emissions DECIMAL(12, 2) NOT NULL,
    is_baseline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
```

**Validation:** Tested migrations locally, verified constraints and foreign keys.

---

## Validation / Corrections

### Backend Validation
- **Unit Tests:** All use case tests pass (ComputeComparison, ComputeCB, CreatePool)
- **Integration Tests:** API endpoints tested with Supertest
- **Manual Testing:** Verified formulas against FuelEU specification

### Frontend Validation
- **Component Rendering:** All tabs render correctly
- **Data Flow:** Props and state management verified
- **API Integration:** Axios calls tested against live backend
- **Responsive Design:** Tested on mobile, tablet, desktop viewports

### Corrections Made
1. **Energy Calculation:** Fixed missing multiplication by 41000 MJ/t factor
2. **Pooling Constraints:** Added validation to ensure deficit ships don't exit worse
3. **Banking Logic:** Added check to prevent banking when CB <= 0
4. **Type Safety:** Strengthened TypeScript types throughout

---

## Observations

### Where Agents Saved Time
1. **Boilerplate Generation:** Repository implementations, API routes (saved ~3 hours)
2. **Test Suite Creation:** Generated comprehensive test cases (saved ~2 hours)
3. **React Components:** Tab components with proper state management (saved ~4 hours)
4. **Type Definitions:** Consistent TypeScript interfaces across layers (saved ~1 hour)

### Where Agents Failed or Hallucinated
1. **Complex Business Logic:** Pooling algorithm required manual refinement
2. **Database Constraints:** Foreign key relationships needed manual verification
3. **Edge Cases:** Banking negative amounts not initially handled
4. **UI/UX Details:** Accessibility features required manual addition

### How Tools Were Combined
1. **Claude Code:** Overall architecture, complex use cases, documentation
2. **GitHub Copilot:** Inline completions for CRUD operations, simple functions
3. **Cursor Agent:** Refactoring large files, organizing imports, formatting

---

## Best Practices Followed

### Code Generation
- Used Claude Code for architectural decisions and domain modeling
- Used Copilot for repetitive CRUD operations
- Always reviewed and tested generated code before committing

### Prompt Engineering
- Started with high-level architecture requests
- Broke down complex features into smaller prompts
- Provided context from FuelEU specification in prompts
- Included expected outputs and validation criteria

### Validation Strategy
- Generated tests alongside implementation code
- Manually verified calculations against specification
- Tested edge cases not covered by agent suggestions
- Reviewed type safety and error handling

### Iterative Refinement
- First pass: Get working code
- Second pass: Add error handling
- Third pass: Improve types and validation
- Fourth pass: Add tests and documentation

---

## Time Breakdown

| Task | Manual Time | AI-Assisted Time | Time Saved |
|------|-------------|------------------|------------|
| Domain Modeling | 2 hours | 30 minutes | 1.5 hours |
| Use Cases | 3 hours | 1 hour | 2 hours |
| Repositories | 4 hours | 1 hour | 3 hours |
| API Controllers | 3 hours | 1 hour | 2 hours |
| React Components | 6 hours | 2 hours | 4 hours |
| Tests | 4 hours | 1.5 hours | 2.5 hours |
| Documentation | 2 hours | 30 minutes | 1.5 hours |
| **Total** | **24 hours** | **7.5 hours** | **16.5 hours** |

**Efficiency Gain: ~69% time reduction**

---

## Conclusion

AI agents significantly accelerated development, particularly for:
- Repetitive code patterns (repositories, controllers)
- Boilerplate (TypeScript types, test scaffolding)
- Documentation structure

However, critical thinking was still required for:
- Business logic validation (CB calculations, pooling algorithm)
- Architecture decisions (hexagonal structure)
- Edge case handling and error management
- User experience and accessibility

The optimal workflow combined AI-generated scaffolding with human oversight and domain expertise.
