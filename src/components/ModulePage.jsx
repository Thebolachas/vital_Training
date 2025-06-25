import Module1Interactive from '../components/Module1Interactive';

function ModulePage() {
  const { id } = useParams();
  if (id === '1') {
    return <Module1Interactive />;
  }
  const modulo = { id, ...modulosData[id] };
  if (!modulo.title) return <div>Não encontrado</div>;
  return <ModuleContainer modulo={modulo} />;
}
