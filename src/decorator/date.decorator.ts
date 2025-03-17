import {registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';

/**
 * Custom decorator that checks if a date property is before another date property.
 *
 * @param property - The name of the related property to compare with.
 * @param validationOptions - Optional validation options.
 * @returns A function that registers the custom validation decorator.
 *
 * @example
 * ```typescript
 * class MyClass {
 *   @IsDateBefore('endDate', { message: 'Start date must be before end date' })
 *   startDate: Date;
 *
 *   endDate: Date;
 * }
 * ```
 * property: 'endDate'
 * validationOptions: { message: 'Start date must be before end date' }
 * object: { startDate: '2021-01-01', endDate: '2021-01-02' }
 * propertyName: 'startDate'
 */
export function IsDateBefore(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateBefore',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value instanceof Date && relatedValue instanceof Date && value < relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} phải trước ${relatedPropertyName}`;
        },
      },
    });
  };
}

/**
 * args: ValidationArguments 
  {
    targetName: 'CreateJobDto',
    property: 'startDate',
    object: CreateJobDto {
      name: 'Tuyển dụng Full Stack Developer',
      skill: [ 'NestJS', 'React', 'MongoDB' ],
      company: CompanyDTO {
        name: 'Thai Company',
        _id: '67d5ade6f13bff399c9cda06'
      },
      location: 'Ha Noi, Vietnam',
      salary: 2000000,
      quantity: 2,
      level: 'Mid-level',
      description: 'We are looking for a skilled full-stack developer with experience in building scalable applications.',
      startDate: 2026-05-01T00:00:00.000Z,
      endDate: 2025-12-31T00:00:00.000Z,
      isActive: true,
      createdAt: '2025-03-17T20:15:43.000Z',
      updatedAt: '2025-03-17T20:15:43.000Z'
    },
    value: 2026-05-01T00:00:00.000Z,
    constraints: [ 'endDate' ]
  }
 */
