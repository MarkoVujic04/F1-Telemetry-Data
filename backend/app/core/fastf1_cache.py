import fastf1
import os
def enable_cache():
    if not os.path.exists('.fastf1-cache'):
        os.makedirs('.fastf1-cache')

    fastf1.Cache.enable_cache('.fastf1-cache')