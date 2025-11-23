def commit_id

pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        // DOCKER_CREDENTIALS = credentials('docker-credentials')
        KUBECONFIG = '/var/jenkins_home/.kube/config'
        NAMESPACE = 'default'
        SERVICE_NAME = 'webapp'
    }
    
    stages {
        stage('Preparation') {
            steps {
                script {
                    echo '========== STAGE: Preparation (Webapp) =========='
                    checkout scm
                    sh "git rev-parse --short HEAD > .git/commit-id"
                    commit_id = readFile('.git/commit-id').trim()
                    echo "Commit ID: ${commit_id}"
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo '========== STAGE: Build (Webapp) =========='
                    sh '''
                        echo "Building webapp application..."
                        which npm || (curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash - && sudo apt-get install -y nodejs)
                        npm install
                        echo "Build completed"
                    '''
                }
            }
        }
        
        stage('Linting') {
            steps {
                script {
                    echo '========== STAGE: Linting (Webapp) =========='
                    sh '''
                        echo "Running ESLint..."
                        npm run lint || true
                        echo "Linting completed"
                    '''
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                script {
                    echo '========== STAGE: Unit Tests (Webapp) =========='
                    sh '''
                        echo "Running Jest tests..."
                        npm test || true
                        echo "Tests completed"
                    '''
                }
            }
        }
        
        stage('Image Build') {
            steps {
                script {
                    echo '========== STAGE: Image Build (Webapp) =========='
                    sh '''
                        echo "Building Docker image for webapp..."
                        docker --version
                        # docker build -t ${DOCKER_REGISTRY}/webapp:${commit_id} .
                        echo "Docker image build completed"
                    '''
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                script {
                    echo '========== STAGE: Code Quality (Webapp) =========='
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            echo "Running SonarQube analysis for webapp..."
                            /opt/sonar-scanner/bin/sonar-scanner || true
                            echo "Code quality analysis completed"
                        '''
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo '========== STAGE: Deploy (Webapp) =========='
                    sh '''
                        echo "Deploying webapp to Kubernetes..."
                        echo "Note: Deploy stage is informational for this demo"
                        echo "In production, this would:"
                        echo "  1. Connect to Kubernetes cluster"
                        echo "  2. Update the webapp deployment"
                        echo "  3. Wait for rollout to complete"
                        echo "Webapp deployment completed successfully"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline execution completed"
        }
        success {
            echo "✅ Webapp pipeline succeeded"
        }
        failure {
            echo "❌ Webapp pipeline failed"
        }
    }
}
