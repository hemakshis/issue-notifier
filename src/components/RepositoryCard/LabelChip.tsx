import React from "react"
import { Theme, makeStyles } from "@material-ui/core/styles"
import { Chip } from "@material-ui/core"
import NotificationsIcon from "@material-ui/icons/Notifications"
import CancelIcon from '@material-ui/icons/Cancel'
import { Label } from "../../utils/types"

const useLabelStyles = makeStyles((theme: Theme) => ({
	notificationIcon: ({ color }: { color: string }) => ({
		color: theme.palette.augmentColor({ main: color }).main,
		"&:hover": {
			color: theme.palette.augmentColor({ main: color }).dark
		}
	}),
	chip: ({ color, selected }: { color: string; selected: boolean }) => ({
		backgroundColor: selected
			? color
			: theme.palette.type === "dark"
				? theme.palette.grey[900]
				: "#fff",
		margin: theme.spacing(0.5),
		borderColor: theme.palette.augmentColor({ main: color }).main,
		color: !selected
			? theme.palette.type !== "dark" ? theme.palette.grey[900] : "#fff"
            : theme.palette.getContrastText(theme.palette.augmentColor({ main: color })[theme.palette.type]),
	}),
}));

const LabelChip: React.FC<Label & { onDelete: (data: Label) => void }> = ({
	name,
	color,
    selected,
    subscribed,
	onDelete,
}) => {
    const labelStyle = useLabelStyles({ color, selected: selected || subscribed })

	return (
		<li key={name}>
            {
                subscribed ?
                <Chip
					label={name}
					className={labelStyle.chip}
					variant="default"
					size="small"
				/> :
				<Chip
					label={name}
					className={labelStyle.chip}
					variant={selected || subscribed ? "default" : "outlined"}
					onDelete={onDelete}
					size={selected || subscribed ? "small" : "medium"}
					deleteIcon={
						subscribed ? undefined :
						!selected ? (
							// BUG: After clicking the subscribe button, background color of the chip is grey and changed to the actual color of label only after losing focus
							<NotificationsIcon className={labelStyle.notificationIcon} />
						) : (
								<CancelIcon />
							)
					}
				/>
            }
		</li>
	);
}

export default LabelChip