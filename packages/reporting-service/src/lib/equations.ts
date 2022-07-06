import { dotAccess } from './dotAccess';

export enum FieldBaseOperators {
  AND = 'AND',
  OR = 'OR',
}

export enum FieldOperators {
  EQ = 'EQ',
  LT = 'LT',
  LTE = 'LTE',
  GT = 'GT',
  GTE = 'GTE',
  IN = 'IN',
}

export type Field = {
  condition?: FieldBaseOperators;
  rules: Rule[];
  not?: boolean;
};

export type UnitField = { field: string; operator: FieldOperators; value: unknown };

export type Rule = UnitField | Field;

export const computeOperator = (
  field: unknown,
  operator: FieldOperators,
  value: unknown
): boolean => {
  switch (operator) {
    case FieldOperators.EQ:
      return String(field) === String(value);

    case FieldOperators.GT:
      if (typeof field === 'number' && typeof value === 'number') return field > value;
      throw new Error('Operands must be number type');

    case FieldOperators.GTE:
      if (typeof field === 'number' && typeof value === 'number') return field >= value;
      throw new Error('Operands must be number type');

    case FieldOperators.LT:
      if (typeof field === 'number' && typeof value === 'number') return field < value;
      throw new Error('Operands must be number type');

    case FieldOperators.LTE:
      if (typeof field === 'number' && typeof value === 'number') return field <= value;
      throw new Error('Operands must be number type');

    case FieldOperators.IN:
      if (Array.isArray(field)) {
        return field.includes(value);
      }
      throw new Error('LHS must be array');

    default:
      throw new Error('Unknown equation');
  }
};

export const getKey = (
  payload: Record<string, unknown>,
  field: string,
  cache: Record<string, unknown>
) => {
  if (cache?.field) {
    return cache[field];
  }

  const data = dotAccess(payload, field);

  if (!data) {
    throw new Error('Cannot find key');
  }

  // eslint-disable-next-line no-param-reassign
  cache[field] = data;
  return data;
};

export const getEquationResult = (
  payload: Record<string, unknown>,
  condition: FieldBaseOperators,
  rules: Rule[],
  not?: boolean,
  cache: Record<string, unknown> = {}
): boolean => {
  return rules.reduce<boolean>(
    (prev, curr) => {
      if ((curr as UnitField)?.field) {
        const u = curr as UnitField;
        const result = computeOperator(getKey(payload, u.field, cache), u.operator, u.value);
        if (condition === FieldBaseOperators.AND) {
          return prev && (not ? !result : result);
        }

        return prev || (not ? !result : result);
      }

      const u = curr as Field;
      if (condition === FieldBaseOperators.AND) {
        return (
          prev &&
          getEquationResult(payload, u.condition || FieldBaseOperators.AND, u.rules, u.not, cache)
        );
      }
      return (
        prev ||
        getEquationResult(payload, u.condition || FieldBaseOperators.AND, u.rules, u.not, cache)
      );
    },
    not ? condition !== FieldBaseOperators.AND : condition === FieldBaseOperators.AND
  );
};
