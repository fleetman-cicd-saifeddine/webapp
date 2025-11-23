# Testing Guide - Webapp

## Unit Tests (Jest)

### Installation
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Test Files
- `index.test.js` - Main API tests

## Test Coverage

The project includes tests for:

1. **GET /** - Homepage endpoint
   - Returns 200 OK
   - Contains "Fleet Management System" text

2. **GET /health** - Health check endpoint
   - Returns 200 OK
   - Returns JSON with status: "UP"

3. **POST /api/vehicles** - Vehicle creation endpoint
   - Accepts vehicle data
   - Returns 201 Created

## SonarQube Integration

Tests are automatically analyzed by SonarQube:
- Coverage reports are generated
- Code quality metrics are calculated
- Issues are detected and reported

### View Coverage Report
```bash
open coverage/index.html
```

## Security Hotspots

The project has been reviewed for security issues:
- No SQL injection vulnerabilities
- No hardcoded credentials
- No sensitive data exposure

## Quality Gate

Current status:
- ✅ Security: PASSED
- ⚠️ Coverage: Needs improvement (target: 80%)
- ⚠️ Duplications: OK

## Improving Quality

To improve the quality gate:

1. **Increase Coverage**
   - Add more test cases
   - Test edge cases
   - Test error scenarios

2. **Fix Issues**
   - Review SonarQube issues
   - Fix code smells
   - Improve maintainability

3. **Security Review**
   - Review security hotspots
   - Implement security best practices
   - Use security headers

## CI/CD Integration

Tests are automatically run in Jenkins:
1. Build stage
2. Linting stage
3. Unit Tests stage
4. Code Quality (SonarQube) stage

All stages must pass before deployment.
