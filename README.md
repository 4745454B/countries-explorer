### Architecture and Design

The application is built using a React and TypeScript framework with Apollo Client for GraphQL integration. It adopts a component-based architecture, ensuring modularity and scalability. The use of SCSS modules provides scoped styling, avoiding conflicts. Key design decisions include managing filtering, sorting, and searching through React state and dynamically fetching unique filters (e.g., continents, languages) from the API response.

## Benefits:

### End Users:

- Intuitive UI with responsive interactions for seamless exploration of countries.

### Developers:

- Type-safe, modular code simplifies maintenance and future feature additions.

### Stakeholders:

- The architecture supports real-time weather data integration for each country, enhancing the application's value to end users by providing additional contextual information.
- This design is extendable, allowing for further features, such as analytics or personalized user experiences, to be seamlessly added in the future.

### Challenges Faced

#### Data Processing and State Management

- **Challenge**:  
  Filtering and sorting large datasets dynamically while maintaining optimal performance.

- **Solution**:  
  Leveraged React's `useState` and `useEffect` hooks to handle state updates and dynamic UI rendering efficiently.

- **Next Steps**:  
  For a larger project, adopting Redux or another state management library would provide a more robust solution for managing complex state logic and actions.

#### Styling and Responsiveness

- **Challenge**:  
  Ensuring a consistent, responsive design across different screen sizes.

- **Solution**:  
  Used SCSS modules with a component-based styling approach for modular and reusable styles.

- **Next Steps**:  
  Incorporate a utility-first CSS framework like TailwindCSS for more flexible styling and Flowbite React for prebuilt UI components to further streamline responsive design efforts and improve development speed.

#### Weather API Rate Limits

- **Challenge**:  
  The OpenWeatherMap API has rate limits, potentially impacting user experience during high usage.

- **Solution**:  
  Added conditional checks to prevent unnecessary API calls (e.g., fetching weather data only when detailed info is expanded).

- **Next Steps**:  
  Implement caching mechanisms to reduce redundant API calls and improve performance.

### SETUP INSTRUCTIONS

1. Run the command to install the necessary dependencies:
   ```bash
   npm install
   ```
2. After the installation is complete, run the following command to start the local development server:
   ```bash
   npm run dev
   ```
