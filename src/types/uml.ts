export type Visibility = '+' | '-' | '#';

export interface UmlAttribute {
  name: string;
  type: string;
  visibility: Visibility;
  description?: string;
}

export interface UmlMethod {
  name: string;
  parameters: { name: string; type: string }[];
  returnType: string;
  visibility: Visibility;
  description?: string;
  isAbstract?: boolean;
}

export type UmlClassType = 'class' | 'abstract' | 'interface' | 'enum';
export type UmlCategory = 'user' | 'catalog' | 'transaction' | 'request' | 'payment';

export interface UmlClass {
  id: string;
  name: string;
  type: UmlClassType;
  category: UmlCategory;
  stereotype?: string;
  description: string;
  attributes: UmlAttribute[];
  methods: UmlMethod[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RelationshipType = 
  | 'inheritance'    // Generalization (solid line, empty triangle)
  | 'composition'    // Composition (solid line, filled diamond)
  | 'aggregation'    // Aggregation (solid line, hollow diamond)
  | 'association'    // Association (solid line, open arrow or plain)
  | 'dependency'     // Dependency (dashed line, open arrow)
  | 'realization';   // Interface implementation (dashed line, empty triangle)

export interface UmlRelationship {
  id: string;
  from: string;
  to: string;
  type: RelationshipType;
  label?: string;
  fromMultiplicity?: string;
  toMultiplicity?: string;
  description?: string;
}
