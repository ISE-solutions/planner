var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography, } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import * as moment from 'moment';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification, useScheduleDay } from '~/hooks';
import { ListStyled } from './styles';
const Schedules = ({ schedules, isDetail, refetch, isLoadModel, isSaved, isModel, handleSchedule, removeDaySchedule, getActivityByTeamId, }) => {
    const [{ desactiveSchedule }] = useScheduleDay({}, {});
    const { confirmation } = useConfirmation();
    const { notification } = useNotification();
    const [listSchedule, setListSchedule] = React.useState(schedules);
    const itemsPerPage = 5;
    const [hasMore, setHasMore] = React.useState(true);
    const [records, setRecords] = React.useState(Math.min(itemsPerPage, (listSchedule === null || listSchedule === void 0 ? void 0 : listSchedule.length) || 0));
    React.useEffect(() => {
        setListSchedule(schedules === null || schedules === void 0 ? void 0 : schedules.sort((left, right) => moment
            .utc(left === null || left === void 0 ? void 0 : left[`${PREFIX}data`])
            .diff(moment.utc(right === null || right === void 0 ? void 0 : right[`${PREFIX}data`]))));
    }, [schedules]);
    const handleDelete = (item) => __awaiter(void 0, void 0, void 0, function* () {
        if (isLoadModel) {
            removeDaySchedule(item === null || item === void 0 ? void 0 : item.keyid);
            const indexSchedule = listSchedule.findIndex((e) => (e === null || e === void 0 ? void 0 : e.keyid) === (item === null || item === void 0 ? void 0 : item.keyid));
            const newSchedule = [...listSchedule];
            newSchedule.splice(indexSchedule, 1);
            setListSchedule(newSchedule);
            notification.success({
                title: 'Sucesso',
                description: 'Excluído realizado com sucesso',
            });
            return;
        }
        const activities = yield getActivityByTeamId(item === null || item === void 0 ? void 0 : item[`_${PREFIX}turma_value`]);
        desactiveSchedule(item === null || item === void 0 ? void 0 : item[`${PREFIX}cronogramadediaid`], activities === null || activities === void 0 ? void 0 : activities.value.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}atividadeid`]), {
            onSuccess: () => {
                refetch === null || refetch === void 0 ? void 0 : refetch();
                const indexSchedule = listSchedule.findIndex((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}cronogramadediaid`]) ===
                    (item === null || item === void 0 ? void 0 : item[`${PREFIX}cronogramadediaid`]));
                const newSchedule = [...listSchedule];
                newSchedule.splice(indexSchedule, 1);
                setListSchedule(newSchedule);
                notification.success({
                    title: 'Sucesso',
                    description: 'Excluído realizado com sucesso',
                });
            },
            onError: (error) => {
                var _a, _b;
                return notification.success({
                    title: 'Falha',
                    description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    });
    const handleConfirmation = (item) => {
        confirmation.openConfirmation({
            title: 'Excluir horário',
            description: 'Deseja excluir o cronograma?',
            onConfirm: () => handleDelete(item),
        });
    };
    const showItems = (schedules) => {
        var items = [];
        for (var i = 0; i < records; i++) {
            let sch = schedules[i];
            items.push(React.createElement(ListItem, { button: true, onClick: () => handleSchedule(sch) },
                React.createElement(ListItemText, { primary: moment
                        .utc(sch === null || sch === void 0 ? void 0 : sch[`${PREFIX}data`])
                        .format(isModel ? 'DD/MM' : 'DD/MM/YYYY'), secondary: sch === null || sch === void 0 ? void 0 : sch[`${PREFIX}nome`] }),
                React.createElement(ListItemSecondaryAction, null, isSaved ? (React.createElement(Tooltip, { title: 'Excluir' },
                    React.createElement(IconButton, { disabled: isDetail, onClick: () => handleConfirmation(sch) },
                        React.createElement(Delete, { color: 'primary' })))) : null)));
        }
        return items;
    };
    const loadMore = () => {
        if (records >= (listSchedule === null || listSchedule === void 0 ? void 0 : listSchedule.length)) {
            setHasMore(false);
        }
        else {
            setTimeout(() => {
                const newQuantity = records + itemsPerPage;
                setRecords(Math.min(newQuantity, listSchedule === null || listSchedule === void 0 ? void 0 : listSchedule.length));
            }, 300);
        }
    };
    return (React.createElement(ListStyled, null,
        React.createElement(InfiniteScroll, { pageStart: 0, loadMore: loadMore, hasMore: hasMore, loader: React.createElement(Typography, null, "N\u00E3o existem cronogramas cadastrados"), useWindow: false }, showItems(listSchedule))));
};
export default Schedules;
//# sourceMappingURL=index.js.map