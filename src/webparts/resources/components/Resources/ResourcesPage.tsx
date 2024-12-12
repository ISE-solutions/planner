import * as React from 'react';
import * as yup from 'yup';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import { useResource } from '~/hooks';
import AccordionVertical from '~/components/AccordionVertical';
import FilterResources from './components/FilterResources';
import Calendar from './components/Calendar';
import { useFormik } from 'formik';
import * as moment from 'moment';
import { useDispatch } from 'react-redux';
import { fetchAllSpace } from '~/store/modules/space/actions';

interface IResourcesPage {
  context: WebPartContext;
}

const ResourcesPage: React.FC<IResourcesPage> = ({ context }) => {
  const validationSchema = yup.object({
    startDate: yup.mixed().required('Campo Obrigatório'),
    endDate: yup.mixed().required('Campo Obrigatório'),
  });

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAllSpace({ active: 'Ativo' }));
  }, []);

  const formik = useFormik({
    initialValues: {
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month'),
      people: [],
      spaces: [],
      tagsFilter: null,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: () => {
      refetch();
    },
  });

  const [{ resources, loading, refetch }] = useResource(formik.values as any, {
    manual: true,
  });

  return (
    <Page
      blockOverflow={false}
      context={context}
      itemsBreadcrumbs={[{ name: 'Recursos', page: 'Recursos' }]}
    >
      <AccordionVertical
        defaultExpanded
        title='Filtro'
        width={260}
        expansibleColumn={
          <FilterResources
            values={formik.values}
            errors={formik.errors}
            setFieldValue={formik.setFieldValue}
            handleFilter={formik.handleSubmit}
            loading={loading}
          />
        }
      >
        <Calendar resources={resources} filter={formik.values} />
      </AccordionVertical>
    </Page>
  );
};

export default ResourcesPage;
