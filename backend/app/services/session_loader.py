import fastf1

def load_session(year: int, gp: str, identifier: str):
    session = fastf1.get_session(year, gp, identifier)
    session.load()
    print("Loaded:", session.event["EventName"], "|", session.event["EventDate"], "|", session.name)
    return session