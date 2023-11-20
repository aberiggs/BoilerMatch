const timeSince = (comparisonTime) => {
    let timeDiff = Math.abs(new Date() - Date.parse(comparisonTime))
    if (timeDiff / 1000 <= 15) {
      return ("Just now")
    }

    timeDiff = Math.floor(timeDiff / 1000) // Seconds
    if (timeDiff / 60 < 1) {
      if (timeDiff == 1) {
        return ("1 second ago")
      }
      return (timeDiff + " seconds ago")
    }

    timeDiff = Math.floor(timeDiff / 60) // Minutes
    if (timeDiff / 60 < 1) {
      if (timeDiff == 1) {
        return ("1 minute ago")
      }
      return (timeDiff + " minutes ago")
    }

    timeDiff = Math.floor(timeDiff / 60) // Hours
    if (timeDiff / 24 < 1) {
      if (timeDiff == 1) {
        return ("1 hour ago")
      }
      return (timeDiff + " hours ago")
    }

    timeDiff = Math.floor(timeDiff / 24) // Day
    if (timeDiff / 30 < 1) {
      if (timeDiff == 1) {
        return ("1 day ago")
      }
      return (timeDiff + " days ago")
    }

    timeDiff  = Math.floor(timeDiff / 30) // Months
    if (timeDiff / 12 < 1) {
      if (timeDiff == 1) {
        return ("1 month ago")
      }
      return (timeDiff + " months ago")
    }
    timeDiff = Math.floor(timeDiff / 12)
    
    if (timeDiff == 1) {
      return ("1 year ago")
    }
    return (timeDiff + " years ago")
  }

  export {timeSince}