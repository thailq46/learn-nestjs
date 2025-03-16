import {faker} from '@faker-js/faker';

interface ICompanyCreate {
  name: string;
  address: string;
  description: string;
}

export const generateCompanyData = (count = 40): ICompanyCreate[] => {
  const companies: ICompanyCreate[] = [];
  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Food',
    'Transportation',
    'Media',
    'Consulting',
    'Real Estate',
    'Energy',
  ];

  // Generate predetermined company names for more realistic data
  const companyNames = [
    'Technosoft Solutions',
    'Bright Future Finance',
    'HealthFirst Medical',
    'EduLearn Academy',
    'InnoTech Systems',
    'Global Logistics',
    'DataNow Inc.',
    'CloudStream Services',
    'Quantum Computing',
    'Green Energy Solutions',
    'Smart Retail Group',
    'Digital Marketing Pro',
    'NextGen Software',
    'Cyber Security Expert',
    'AI Innovations',
    'Modern Architecture',
    'Financial Partners',
    'Medical Supplies Inc.',
    'Education First Group',
    'Global Trading Co.',
    'Fresh Food Delivery',
    'Transport Solutions',
    'Media Productions',
    'Business Consultants',
    'Real Estate Investments',
    'Clean Energy Corp',
    'Industrial Machines',
    'Retail Solutions',
    'Future Technologies',
    'Smart Home Systems',
    'VN Success Group',
    'Sai Gon Investments',
    'Hanoi Tech Hub',
    'Danang Innovations',
    'Vietnam Solutions',
    'Mekong Trade Center',
    'Southeast Retail',
    'ASEAN Partnership',
    'Pacific Investments',
    'Asia Connections',
  ];

  // Create companies
  for (let i = 0; i < count; i++) {
    const industry = faker.helpers.arrayElement(industries);
    const name = i < companyNames.length ? companyNames[i] : `${industry} ${faker.company.name()}`;

    // Generate lorem paragraphs with HTML formatting
    const descriptionParagraphs = Array(faker.number.int({min: 3, max: 6}))
      .fill(0)
      .map(() => `<p>${faker.lorem.paragraph({min: 4, max: 10})}</p>`);

    // Add some formatted content like lists and headings
    const aboutUs = `<h2>About Us</h2><p>${faker.lorem.paragraph(8)}</p>`;
    const mission = `<h2>Our Mission</h2><p>${faker.lorem.paragraph(5)}</p>`;
    const values = `<h2>Our Values</h2><ul>${Array(4)
      .fill(0)
      .map(() => `<li>${faker.lorem.sentence()}</li>`)
      .join('')}</ul>`;

    // Combine all HTML content
    const description = `
      ${aboutUs}
      ${descriptionParagraphs.join('')}
      ${mission}
      ${values}
    `;

    companies.push({
      name,
      address: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.country(),
      description,
    });
  }

  return companies;
};

export default async function seedCompanies() {
  // Generate company data
  const companies = generateCompanyData(40);

  // Add creation timestamps and other required fields
  const companiesToInsert = companies.map((company) => ({
    ...company,
    createdBy: {
      _id: '67d5917f571770a99f4378d5',
      name: 'Thailq',
    },
    updatedBy: {
      _id: '67d5917f571770a99f4378d5',
      name: 'Thailq',
    },
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return companiesToInsert;
}
