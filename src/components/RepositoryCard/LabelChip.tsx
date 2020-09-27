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
		if (!inSettingsPage) {
			return {
				backgroundColor: (selected || subscribed)
					? color
					: theme.palette.type === "dark"
						? theme.palette.grey[900]
						: "#fff",
				margin: theme.spacing(0.5),
				borderColor: theme.palette.augmentColor({ main: color }).main,
				color: !(selected || subscribed)
					? theme.palette.type !== "dark" ? theme.palette.grey[900] : "#fff"
					: theme.palette.getContrastText(theme.palette.augmentColor({ main: color })[theme.palette.type]),
			}
		} else {
			return {
				backgroundColor: !selected
					? color
					: theme.palette.type === "dark"
						? theme.palette.grey[900]
						: "#fff",
				margin: theme.spacing(0.5),
				borderColor: theme.palette.augmentColor({ main: color }).main,
				color: selected
					? theme.palette.type !== "dark" ? theme.palette.grey[900] : "#fff"
					: theme.palette.getContrastText(theme.palette.augmentColor({ main: color })[theme.palette.type]),
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
		// BUG: After clicking the subscribe button, background color of the chip is grey and changed to the actual color of label only after losing focus
		if (!inSettingsPage && !selected)
			return	<NotificationsIcon className={labelStyle.notificationsIcon} />
		if (inSettingsPage && !selected)
			return <NotificationsOffIcon />
		if (selected)
			return <CancelIcon />
	}

	const getVariant = () => {
		if (!inSettingsPage && !selected)
			return	"outlined"
		if (inSettingsPage && !selected)
			return "default"
		if (inSettingsPage && selected)
			return "outlined"
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