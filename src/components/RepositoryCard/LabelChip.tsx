import React from "react"
import { Theme, makeStyles } from "@material-ui/core/styles"
import { Chip } from "@material-ui/core"
import NotificationsIcon from "@material-ui/icons/Notifications"
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff'
import CancelIcon from '@material-ui/icons/Cancel'
import { Label } from "../../utils/types"

export type LabelChipProps = Label & { 
	inSettingsPage?: boolean; 
	onDelete: (data: Label) => void; 
}

const useLabelStyles = makeStyles((theme: Theme) => ({
	notificationsIcon: (props: any) => ({
		color: theme.palette.augmentColor({ main: props.color }).main,
		"&:hover": {
			color: theme.palette.augmentColor({ main: props.color }).dark
		}
	}),
	chip: (props: any) => {
		const { color, selected, subscribed, inSettingsPage } = props
		const customChips = (condition: boolean) => ({
			backgroundColor: condition
				? color
				: theme.palette.type === "dark"
					? theme.palette.grey[900]
					: "#fff",
			margin: theme.spacing(0.5),
			borderColor: theme.palette.augmentColor({ main: color }).main,
			color: !condition
				? theme.palette.type !== "dark" ? theme.palette.grey[900] : "#fff"
				: theme.palette.getContrastText(theme.palette.augmentColor({ main: color })[theme.palette.type]),
		})

		if (!inSettingsPage) {
			return {
				...customChips(selected || subscribed),
				"&:focus, &.MuiChip-outlined:focus": customChips(selected || subscribed)
			}
		} else {
			return {
				...customChips(!selected),
				"&:focus, &.MuiChip-outlined:focus": customChips(!selected)
			}
		}

	},
}));

const LabelChip: React.FC<LabelChipProps> = ({
	name,
	color,
    selected,
	subscribed,
	inSettingsPage,
	onDelete,
}) => {

	const labelStyle = useLabelStyles({ color, selected, subscribed, inSettingsPage })
	
	// TODO: Make this more cleaner
	const getDeleteIcon = () => {
		if (!inSettingsPage && !selected)
			return	<NotificationsIcon className={labelStyle.notificationsIcon} />
		if (inSettingsPage && !selected)
			return <NotificationsOffIcon />
		if (selected)
			return <CancelIcon />
	}

	const getVariant = () => {
		if ((!inSettingsPage && !selected) || (inSettingsPage && selected))
			return	"outlined"
		if (inSettingsPage && !selected)
			return "default"
	}

	const getSize = () => {
		if ((!inSettingsPage && !selected) || (inSettingsPage && selected))
			return	"medium"
		if ((inSettingsPage && !selected) || (!inSettingsPage && selected))
			return "small"
	}

	return (
		<li key={name}>
            {
                !inSettingsPage && subscribed ?
                <Chip
					label={name}
					className={labelStyle.chip}
					variant="default"
					size="small"
				/> :
				<Chip
					label={name}
					className={labelStyle.chip}
					variant={getVariant()}
					onDelete={onDelete}
					size={getSize()}
					deleteIcon={getDeleteIcon()}
				/>
            }
		</li>
	);
}

export default LabelChip