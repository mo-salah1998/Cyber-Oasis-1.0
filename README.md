# Cyber Oasis 1.0: Hack the Dunes

Official website for the first Maghreb student forum & hackathon in cybersecurity.

## Event Details

- **Date**: October 24-26, 2025
- **Location**: Faculty of Sciences of Gabès – Tunisia
- **Countries**: Tunisia, Algeria, Libya
- **Type**: 3-day cybersecurity hackathon and conference

## Website Features

### Design
- **Theme**: Desert-inspired design with cyber aesthetics
- **Colors**: Dark blue/black, orange, and sand colors inspired by the event poster
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth scrolling and fade-in animations

### Sections
1. **Home**: Hero section with event overview and call-to-action buttons
2. **About**: Event mission and details
3. **Program**: Detailed 3-day schedule with conferences and workshops
4. **Hackathon**: CTF competition details and registration requirements
5. **Conferences & Workshops**: Expert-led sessions
6. **Partners**: Organizers and technical partners
7. **Contact**: Contact information and quick contact form

### Interactive Features
- **Registration Form**: Complete team registration with validation
- **Contact Form**: Quick contact form for inquiries
- **Mobile Menu**: Responsive navigation for mobile devices
- **Smooth Scrolling**: Enhanced navigation experience
- **Form Validation**: Client-side and server-side validation

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Backend**: Serverless functions (Vercel/Netlify compatible)
- **Deployment**: Static site with serverless API

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd cyber-oasis-website
```

2. Install dependencies:
```bash
npm install
```

3. Start local development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Deployment

#### Vercel (Recommended)
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.`
4. Deploy

#### Other Platforms
The website is a static site and can be deployed to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh

## API Endpoints

### Registration
- **POST** `/api/register`
- **Body**: Registration form data
- **Response**: Success/error message with registration ID

### Contact
- **POST** `/api/contact`
- **Body**: Contact form data
- **Response**: Success/error message with contact ID

## Form Fields

### Registration Form
- Team Name (Nickname)
- University
- Team Leader Name
- Team Member Name
- Faculty/School/Institute
- Level of Study
- Field of Study/Major
- Team Leader Email
- Team Leader Phone
- Previous Cybersecurity Knowledge
- Previous Hackathon Experience

### Contact Form
- Name
- Email
- Message

## Customization

### Colors
The website uses a custom color palette inspired by the event poster:
- `desert-night`: #0a0e1a
- `desert-blue`: #1e293b
- `desert-orange`: #ea580c
- `desert-sand`: #f59e0b
- `desert-gold`: #fbbf24

### Content
All content can be easily modified in the HTML file. The website is structured with clear sections and semantic HTML.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - see LICENSE file for details.

## Contact

For questions about the website or event:
- Email: contact@cyberoasis.tn
- Website: [Cyber Oasis 1.0](https://cyberoasis.tn)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Acknowledgments

- Event organizers: University of Gabès, University of Guelma, University of Zawia
- Technical partners: Protected Consulting, KyubiSec
- Design inspiration: Cyber Oasis 1.0 event poster
