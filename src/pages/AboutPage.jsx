import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import {
  FitnessCenter,
  Code,
  Security,
  Devices,
  DragIndicator,
  GitHub,
} from '@mui/icons-material';

export default function AboutPage() {
  const technologies = [
    { name: 'React 19', description: 'Biblioteca principal para construção da interface' },
    { name: 'Material-UI (MUI)', description: 'Biblioteca de componentes para design system' },
    { name: 'Firebase', description: 'Backend as a Service para autenticação e banco de dados' },
    { name: 'React Router DOM', description: 'Roteamento da aplicação' },
    { name: '@hello-pangea/dnd', description: 'Funcionalidade de drag and drop' },
    { name: 'Vite', description: 'Build tool e dev server' },
    { name: 'ESLint', description: 'Linting e padronização de código' },
  ];

  const features = [
    { icon: <FitnessCenter />, text: 'Gerenciamento de exercícios' },
    { icon: <DragIndicator />, text: 'Interface drag and drop' },
    { icon: <Security />, text: 'Autenticação com Firebase' },
    { icon: <Devices />, text: 'Design responsivo com Material-UI' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Workout Manager
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Um aplicativo moderno de gerenciamento de exercícios
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Desenvolvido com React e Material-UI, ideal para organizar treinos e acompanhar progresso.
          Este projeto foi criado para explorar novas tecnologias e demonstrar habilidades em desenvolvimento frontend moderno.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Sobre o Projeto */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sobre o Projeto
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                O Workout Manager é um projeto de portfólio que demonstra a implementação de um sistema 
                completo de gerenciamento de treinos utilizando tecnologias modernas do ecossistema React.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                O objetivo principal é explorar e aplicar conceitos avançados de desenvolvimento frontend, 
                incluindo gerenciamento de estado, autenticação, banco de dados em tempo real e interfaces 
                interativas com drag and drop.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este projeto serve como uma demonstração prática de habilidades técnicas e boas práticas 
                de desenvolvimento, demonstrando competências em React, Firebase e design de interfaces.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Funcionalidades */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <FitnessCenter sx={{ mr: 1, verticalAlign: 'middle' }} />
                Funcionalidades
              </Typography>
              <List dense>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {feature.icon}
                    </ListItemIcon>
                    <ListItemText primary={feature.text} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Mais funcionalidades estão sendo implementadas continuamente para expandir 
                as capacidades do sistema e explorar novas tecnologias.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tecnologias */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🚀 Tecnologias Utilizadas
              </Typography>
              <Grid container spacing={2}>
                {technologies.map((tech, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={tech.name} 
                        variant="outlined" 
                        sx={{ mb: 1, fontWeight: 'bold' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {tech.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Como Usar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🎯 Como Usar
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="1. Faça login na aplicação" 
                    secondary="Utilize sua conta para acessar o sistema"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="2. Crie seus exercícios personalizados" 
                    secondary="Adicione exercícios conforme sua rotina"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="3. Organize-os usando drag and drop" 
                    secondary="Arraste e solte para reordenar seus treinos"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="4. Acompanhe seu progresso" 
                    secondary="Monitore sua evolução ao longo do tempo"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contribuição */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🤝 Contribuição
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Este é um projeto de portfólio, mas sugestões e contribuições são sempre bem-vindas!
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Se você tem ideias para melhorar o projeto ou encontrou algum bug, 
                sinta-se à vontade para abrir uma issue ou enviar um pull request.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Link 
                  href="https://github.com/igorcsp/workout-manager" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  <GitHub sx={{ mr: 1 }} />
                  Ver no GitHub
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          ⭐ Se este projeto te ajudou ou inspirou, deixe uma estrela no GitHub!
        </Typography>
      </Box>
    </Container>
  );
}
