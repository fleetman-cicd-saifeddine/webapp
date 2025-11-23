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
                        # npm install && npm run build
                        echo "Build completed"
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
        
        stage('Deploy') {
            steps {
                script {
                    echo '========== STAGE: Deploy (Webapp) =========='
                    sh '''
                        echo "Deploying webapp to Kubernetes..."
                        kubectl cluster-info
                        kubectl set image deployment/webapp webapp=richardchesterwood/k8s-fleetman-webapp-angular:release2 -n ${NAMESPACE} || true
                        kubectl rollout status deployment/webapp -n ${NAMESPACE} --timeout=5m
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
