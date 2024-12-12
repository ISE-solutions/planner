import * as React from 'react';
import * as yup from 'yup';
import Page from '~/components/Page';
import { useResource } from '~/hooks';
import AccordionVertical from '~/components/AccordionVertical';
import FilterResources from './components/FilterResources';
import Calendar from './components/Calendar';
import { useFormik } from 'formik';
import * as moment from 'moment';
import { useDispatch } from 'react-redux';
import { fetchAllSpace } from '~/store/modules/space/actions';
const ResourcesPage = ({ context }) => {
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
    const [{ resources, loading, refetch }] = useResource(formik.values, {
        manual: true,
    });
    return (React.createElement(Page, { blockOverflow: false, context: context, itemsBreadcrumbs: [{ name: 'Recursos', page: 'Recursos' }] },
        React.createElement(AccordionVertical, { defaultExpanded: true, title: 'Filtro', width: 260, expansibleColumn: React.createElement(FilterResources, { values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleFilter: formik.handleSubmit, loading: loading }) },
            React.createElement(Calendar, { resources: resources, filter: formik.values }))));
};
export default ResourcesPage;
//# sourceMappingURL=ResourcesPage.js.map